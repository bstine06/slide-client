import { WallDrawable } from "./WallDrawable";
import { PathDrawable } from "./PathDrawable";

export function buildWallLayer(
    board: number[][],
    cellSize: number
): HTMLCanvasElement {
    const offscreen = document.createElement("canvas");
    offscreen.width = board[0].length * cellSize;
    offscreen.height = board[0].length * cellSize;
    const ctx = offscreen.getContext("2d")!;

    generateWalls(board, cellSize, ctx);

    return offscreen;
}

function generateWalls(
    board: number[][],
    cellSize: number,
    ctx: CanvasRenderingContext2D
) {
    const height = board.length;
    const width = board[0].length;

    const dirs = [
        { dx: 0, dy: -1 }, // N
        { dx: 1, dy: 0 },  // E
        { dx: 0, dy: 1 },  // S
        { dx: -1, dy: 0 }, // W
    ];

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {

            // skip if this is not a wall
            if (board[y][x] !== 1) continue;

            let wallType = "w";

            for (const {dx, dy} of dirs) {
                const nx = x + dx;
                const ny = y + dy;
                const isWall =
                    ny < 0 || ny >= height ||
                    nx < 0 || nx >= width ||
                    board[ny][nx] === 1;
                wallType += isWall ? "1" : "0";
            }

            const wall = new WallDrawable(
                x * cellSize,
                y * cellSize,
                cellSize,
                cellSize
            );
            wall.draw(ctx, wallType);
        }
    }
}
