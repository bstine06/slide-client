// --- Imports for all 16 patterns ---
import b00bmp from '../resources/b00.bmp';
import b01bmp from '../resources/b01.bmp';
import b02bmp from '../resources/b02.bmp';
import b03bmp from '../resources/b03.bmp';
import b04bmp from '../resources/b04.bmp';
import b05bmp from '../resources/b05.bmp';
import b06bmp from '../resources/b06.bmp';
import b07bmp from '../resources/b07.bmp';
import b08bmp from '../resources/b08.bmp';
import b09bmp from '../resources/b09.bmp';
import b10bmp from '../resources/b10.bmp';
import b11bmp from '../resources/b11.bmp';
import b12bmp from '../resources/b12.bmp';
import b13bmp from '../resources/b13.bmp';
import b14bmp from '../resources/b14.bmp';
import b15bmp from '../resources/b15.bmp';

const sludgeSprites: HTMLImageElement[] = [
    new Image(),
    new Image(),
    new Image(),
    new Image(),
    new Image(),
    new Image(),
    new Image(),
    new Image(),
    new Image(),
    new Image(),
    new Image(),
    new Image(),
    new Image(),
    new Image(),
    new Image(),
    new Image()
];

sludgeSprites[0].src = b00bmp;
sludgeSprites[1].src = b01bmp;
sludgeSprites[2].src = b02bmp;
sludgeSprites[3].src = b03bmp;
sludgeSprites[4].src = b04bmp;
sludgeSprites[5].src = b05bmp;
sludgeSprites[6].src = b06bmp;
sludgeSprites[7].src = b07bmp;
sludgeSprites[8].src = b08bmp;
sludgeSprites[9].src = b09bmp;
sludgeSprites[10].src = b10bmp;
sludgeSprites[11].src = b11bmp;
sludgeSprites[12].src = b12bmp;
sludgeSprites[13].src = b13bmp;
sludgeSprites[14].src = b14bmp;
sludgeSprites[15].src = b15bmp;

export function buildAnimatedLayer(
    board: number[][],
    cellSize: number
): HTMLCanvasElement[] {
    const cols = board[0].length;
    const rows = board.length;

    const frames: HTMLCanvasElement[] = Array.from({ length: 16 }, () => {
        const c = document.createElement("canvas");
        c.width  = cols * cellSize;
        c.height = rows * cellSize;
        return c;
    });

    // create each frame with its own context
    return frames.map((canvas, i) => {
        const ctx = canvas.getContext("2d")!;
        generateFrame(board, cellSize, ctx, i);
        return canvas;
    });
}


function generateFrame(
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
            const sprite = sludgeSprites[(x + y + frameIndex) % sludgeSprites.length];
            ctx.drawImage(sprite, x * cellSize, y * cellSize, cellSize, cellSize);
        }
    }
}

