import { PlayerDrawable } from "./PlayerDrawable";
import { GameDto, MazeTheme } from "../types/GameTypes";
import { buildWallLayer } from "./WallLayer";
import { buildAnimatedLayer } from "./AnimatedLayer";
import { buildPathLayer } from "./PathLayer";
import { PathDrawable } from "./PathDrawable";
import { WallDrawable } from "./WallDrawable";

let wallLayerCaches: HTMLCanvasElement[] = [];
let backgroundLayerCaches: HTMLCanvasElement[][] = [];
let pathLayerCaches: HTMLCanvasElement[] = [];
let playerDrawables: Map<string, PlayerDrawable[]> = new Map();

let lastTime = performance.now();
let elapsed = 0;

export async function renderGame(
    context: CanvasRenderingContext2D,
    game: GameDto,
    playerName: string
) {
    if (wallLayerCaches.length === 0)
        throw new Error(
            "Graphics cache (wallLayer) was never loaded before render"
        );
    if (backgroundLayerCaches.length === 0)
        throw new Error(
            "Graphics cache (backgroundLayer) was never loaded before render"
        );
    if (pathLayerCaches.length === 0)
        throw new Error(
            "Graphics cache (pathLayer) was never loaded before render"
        );
    if (playerDrawables.size === 0)
        throw new Error("Player Drawables were never loaded before render");

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

    // Clear the canvas
    context.fillStyle = "#333";
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Draw the background layer from cache
    context.drawImage(backgroundLayerCaches[player.level][frame], 0, 0);

    const maxPrevious = 3;
    const startLevel = Math.max(0, player.level - maxPrevious);

    for (let l = startLevel; l <= player.level; ++l) {
        const scale = Math.pow(0.8, player.level - l);
        const alpha = Math.pow(0.6, player.level - l);

        const w = canvas.width * scale;
        const h = canvas.height * scale;
        const offsetX = (canvas.width - w) / 2;
        const offsetY = (canvas.height - h) / 2;

        context.save();
        context.globalAlpha = alpha;

        // Draw wall and path layers
        context.drawImage(wallLayerCaches[l], offsetX, offsetY, w, h);
        context.drawImage(pathLayerCaches[l], offsetX, offsetY, w, h);

        // Draw other players
        Object.values(game.players).forEach((p) => {
            if (p.level === l && p.username !== playerName) {
                const isMoving = p.vx + p.vy !== 0;
                const px = offsetX + p.x * (w / board[0].length);
                const py = offsetY + p.y * (h / board.length);

                playerDrawables
                    .get(p.username)!
                    [l].draw(
                        context,
                        px,
                        py,
                        cellSize * scale,
                        cellSize * scale,
                        frame,
                        isMoving,
                        p.angle
                    );
            }
        });

        context.restore();
    }
    // Draw this session's player last to make sure they are on top
    const p = game.players[playerName];
    const isMoving = p.vx + p.vy !== 0;
    playerDrawables
        .get(p.username)!
        [player.level].draw(
            context,
            p.x * cellSize,
            p.y * cellSize,
            cellSize,
            cellSize,
            frame,
            isMoving,
            p.angle
        );
}

export function eraseCaches(): void {
    wallLayerCaches = [];
    backgroundLayerCaches = [];
    pathLayerCaches = [];
}

export async function buildCaches(
    context: CanvasRenderingContext2D,
    game: GameDto
): Promise<void> {
    await PathDrawable.preLoadAssets();
    await PlayerDrawable.preLoadAssets();
    await WallDrawable.preLoadAssets();

    for (let l = 0; l < game.mazes.length; ++l) {
        const canvas = context.canvas;
        const maze = game.mazes[l];
        const board = maze.board;
        const cellSize = canvas.width / board[0].length;

        Object.values(game.players).forEach((p) => {
            if (!playerDrawables.has(p.username))
                playerDrawables.set(p.username, []);
            playerDrawables.get(p.username)![l] = new PlayerDrawable(
                p.x * cellSize,
                p.y * cellSize,
                cellSize,
                cellSize,
                p.color
            );
        });

        wallLayerCaches[l] = buildWallLayer(board, cellSize);

        backgroundLayerCaches[l] = buildAnimatedLayer(board, cellSize);

        pathLayerCaches[l] = buildPathLayer(board, cellSize, maze.theme);
    }
}
