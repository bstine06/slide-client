import { WallDrawable } from "./WallDrawable";
import { GoalDrawable } from "./GoalDrawable";
import { PathDrawable } from "./PathDrawable";
import { MazeTheme } from "../types/GameTypes";

export function buildPathLayer(
    board: number[][],
    cellSize: number,
    theme: MazeTheme
): HTMLCanvasElement {
    const offscreen = document.createElement("canvas");
    offscreen.width = board[0].length * cellSize;
    offscreen.height = board[0].length * cellSize;
    const ctx = offscreen.getContext("2d")!;

    generatePath(board, cellSize, ctx);

    return offscreen;
}

function generatePath (
    board: number[][],
    cellSize: number,
    ctx: CanvasRenderingContext2D
) {
    const height = board.length;
    const width = board[0].length;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {

            // skip if this space is a wall
            if (board[y][x] === 1) continue;

            const pathType = "p000" + Math.floor((Math.pow(Math.random(), 20) * 3));

            const path = new PathDrawable(
                x * cellSize,
                y * cellSize,
                cellSize,
                cellSize
            );

            path.draw(ctx, pathType);

             // draw the goal on top of the path where appropriate
            if (board[y][x] === 3) {
                const goal = new GoalDrawable(
                    x * cellSize,
                    y * cellSize,
                    cellSize,
                    cellSize
                );
                goal.draw(ctx);
            }
        }
    }
}
