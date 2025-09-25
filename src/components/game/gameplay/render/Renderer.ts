import { PlayerDrawable } from "./PlayerDrawable";
import { GameDto  } from "../../../../types/GameTypes";
import { buildWallLayer } from "./WallLayer";

let wallLayerCache: { canvas: HTMLCanvasElement; mazeIndex: number } | null = null;

export function renderGame(context: CanvasRenderingContext2D, game: GameDto, playerName: string) {
    const canvas = context.canvas;
    const player = game.players[playerName];
    const maze = game.mazes[player.level].board;
    const cellSize = canvas.width / maze[0].length;

    // Build once per maze level
    if (!wallLayerCache || wallLayerCache.mazeIndex !== player.level) {
        // rebuild cache only if the level changed
        wallLayerCache = {
            canvas: buildWallLayer(maze, cellSize),
            mazeIndex: player.level
        };
    }

    // Clear & draw
    context.fillStyle = "#888";
    context.fillRect(0, 0, canvas.width, canvas.height);
    if (!(wallLayerCache.canvas instanceof HTMLCanvasElement)) {
        throw new Error("Not a real HTMLCanvasElement");
    }
    context.drawImage(wallLayerCache.canvas, 0, 0);

    // Draw players
    Object.values(game.players).forEach(p => {
        if (p.level === player.level) {
            new PlayerDrawable(
                p.x * cellSize,
                p.y * cellSize,
                cellSize,
                cellSize,
                p.color
            ).draw(context);
        }
    });
}
