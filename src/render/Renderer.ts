import { PlayerDrawable } from "./PlayerDrawable";
import { GameDto, MazeTheme } from "../types/GameTypes";
import { buildWallLayer } from "./WallLayer";
import { buildAnimatedLayer } from "./AnimatedLayer";
import { buildPathLayer } from "./PathLayer";

let wallLayerCache: { canvas: HTMLCanvasElement; mazeIndex: number } | null = null;
let backgroundLayerCache: { canvas: HTMLCanvasElement[]; mazeIndex: number } | null = null;
let pathLayerCache: { canvas: HTMLCanvasElement; mazeIndex: number } | null = null;

let lastTime = performance.now();
let elapsed = 0;

export async function renderGame(context: CanvasRenderingContext2D, game: GameDto, playerName: string) {
    const canvas = context.canvas;
    const player = game.players[playerName];
    const maze = game.mazes[player.level];
    const board = maze.board;
    const cellSize = canvas.width / board[0].length;

    // update clock for background/environment animations
    const now = performance.now();
    elapsed += (now - lastTime) / 1000;
    lastTime = now;
    const frameDuration = 0.1; // seconds per frame
    const frame = Math.floor(elapsed / frameDuration) % 16;

    // Build a cache of the background if it doesnt exist yet for this maze
    if (
        !backgroundLayerCache ||
        backgroundLayerCache.mazeIndex !== player.level
    ) {
        backgroundLayerCache = {
            canvas: buildAnimatedLayer(board, cellSize),
            mazeIndex: player.level,
        };
    }

    // Build a cache of the path if it doesnt exist yet for this maze
    if (!pathLayerCache || pathLayerCache.mazeIndex !== player.level) {
        pathLayerCache = {
            canvas: buildPathLayer(board, cellSize, maze.theme),
            mazeIndex: player.level,
        };
    }

    // Build a cache of the walls if it doesnt exist yet for this maze
    if (!wallLayerCache || wallLayerCache.mazeIndex !== player.level) {
        // rebuild cache only if the level changed
        wallLayerCache = {
            canvas: buildWallLayer(board, cellSize),
            mazeIndex: player.level
        };
    }

    // Clear the canvas
    context.fillStyle = "#333";
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Draw the background layer from cache
    context.drawImage(backgroundLayerCache.canvas[frame], 0, 0);

    // Draw the path layer from cache
    context.drawImage(pathLayerCache.canvas, 0, 0);

    // Draw the wall layer from cache
    context.drawImage(wallLayerCache.canvas, 0, 0);

    // Draw players that aren't this player first
    Object.values(game.players).forEach((p) => {
        if (p.level === player.level) {
            if (p.username !== playerName) {
                const isMoving = p.vx + p.vy !== 0;
                new PlayerDrawable(
                    p.x * cellSize,
                    p.y * cellSize,
                    cellSize,
                    cellSize
                ).draw(context, frame, isMoving, p.angle);
            }
        }
    });

    // Draw this session's player last to make sure they are on top
    const p = game.players[playerName];
    const isMoving = p.vx + p.vy !== 0;
    new PlayerDrawable(p.x * cellSize, p.y * cellSize, cellSize, cellSize).draw(
        context,
        frame,
        isMoving,
        p.angle
    );
}
