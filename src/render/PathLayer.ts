// --- Imports for all 16 patterns ---
import b00bmp from '../resources/b00.bmp';
import b01bmp from '../resources/b01.bmp';
import b02bmp from '../resources/b02.bmp';
import b03bmp from '../resources/b03.bmp';
import b04bmp from '../resources/b04.bmp';
import b05bmp from '../resources/b05.bmp';
import b06bmp from '../resources/b06.bmp';
import b07bmp from '../resources/b07.bmp';

const patternSprites: HTMLImageElement[] = [
    new Image(),
    new Image(),
    new Image(),
    new Image(),
    new Image(),
    new Image(),
    new Image(),
    new Image()
];

patternSprites[0].src = b00bmp;
patternSprites[1].src = b01bmp;
patternSprites[2].src = b02bmp;
patternSprites[3].src = b03bmp;
patternSprites[4].src = b04bmp;
patternSprites[5].src = b05bmp;
patternSprites[6].src = b06bmp;
patternSprites[7].src = b07bmp;

export function buildPathLayers(
    board: number[][],
    cellSize: number
): HTMLCanvasElement[] {
    const cols = board[0].length;
    const rows = board.length;

    const frames: HTMLCanvasElement[] = Array.from({ length: 8 }, () => {
        const c = document.createElement("canvas");
        c.width  = cols * cellSize;
        c.height = rows * cellSize;
        return c;
    });

    // create each frame with its own context
    return frames.map((canvas, i) => {
        const ctx = canvas.getContext("2d")!;
        generatePathFrame(board, cellSize, ctx, i);
        return canvas;
    });
}


function generatePathFrame(
    board: number[][],
    cellSize: number,
    ctx: CanvasRenderingContext2D,
    frameIndex: number
): void {
    const rows = board.length;
    const cols = board[0].length;

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            // Example: pick a sprite based on frameIndex
            // (replace with your own logic / sprite array)
            const sprite = patternSprites[(x + y + frameIndex) % patternSprites.length];
            ctx.drawImage(sprite, x * cellSize, y * cellSize, cellSize, cellSize);
        }
    }
}

