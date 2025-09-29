import { PlayerDrawable } from "./PlayerDrawable";
import { GameDto  } from "../types/GameTypes";
import { buildWallLayer } from "./WallLayer";
import { buildPathLayers } from "./PathLayer";

let wallLayerCache: { canvas: HTMLCanvasElement; mazeIndex: number } | null = null;
let pathLayersCache: { canvas: HTMLCanvasElement[]; mazeIndex: number } | null = null;

let lastTime = performance.now();
let elapsed = 0;

export async function renderGame(context: CanvasRenderingContext2D, game: GameDto, playerName: string) {
    const canvas = context.canvas;
    const player = game.players[playerName];
    const maze = game.mazes[player.level].board;
    const cellSize = canvas.width / maze[0].length;

    // update clock for background/environment animations
    const now = performance.now();
    elapsed += (now - lastTime) / 1000;
    lastTime = now;
    const frameDuration = 0.2;               // seconds per frame
    const frame = Math.floor(elapsed / frameDuration) % 8;

    // Build a cache of the background (path) if it doesnt exist yet for this maze
    if (!pathLayersCache || pathLayersCache.mazeIndex !== player.level) {
        pathLayersCache = {
            canvas: buildPathLayers(maze, cellSize),
            mazeIndex: player.level
        }
    }

    // Build a cache of the walls if it doesnt exist yet for this maze
    if (!wallLayerCache || wallLayerCache.mazeIndex !== player.level) {
        // rebuild cache only if the level changed
        wallLayerCache = {
            canvas: buildWallLayer(maze, cellSize),
            mazeIndex: player.level
        };
    }

    // Clear the canvas
    context.fillStyle = "#888";
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Draw the background (path layer) from cache
    context.drawImage(pathLayersCache.canvas[frame], 0, 0);

    // Draw the wall layer from cache
    if (!(wallLayerCache.canvas instanceof HTMLCanvasElement)) {
        throw new Error("Not a real HTMLCanvasElement");
    }
    context.drawImage(wallLayerCache.canvas, 0, 0);

    // Draw players that aren't this player first
    Object.values(game.players).forEach(p => {
        if (p.level === player.level) {
            if (p.username !== playerName) {
                new PlayerDrawable(
                    p.x * cellSize,
                    p.y * cellSize,
                    cellSize,
                    cellSize,
                    p.color
                ).draw(context);
            }
        }
    });

    // Draw this session's player last to make sure they are on top
    const p = game.players[playerName];
    new PlayerDrawable(
        p.x * cellSize,
        p.y * cellSize,
        cellSize,
        cellSize,
        p.color
    ).draw(context);

}
