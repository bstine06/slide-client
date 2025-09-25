import { buildGoalCache } from "./GoalDrawable";

// WallLayer.ts
export function buildWallLayer(board: number[][], cellSize: number): HTMLCanvasElement {
    const rows = board.length;
    const cols = board[0].length;
    const offscreen = document.createElement("canvas");
    offscreen.width = cols * cellSize;
    offscreen.height = rows * cellSize;
    const ctx = offscreen.getContext("2d")!;

    // Build goal once
    const goalCache = buildGoalCache(cellSize);

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            if (board[y][x] === 1) {
                ctx.fillStyle = "#222";
                ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
            } else if (board[y][x] === 2) {
                ctx.fillStyle = "#AAA";
                ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
            } else if (board[y][x] === 3) {
                ctx.drawImage(goalCache, x * cellSize, y * cellSize);
            }
        }
    }
    return offscreen;
}
