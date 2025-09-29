export function buildGoalCache(cellSize: number, color: string = "#11FF22"): HTMLCanvasElement {
    const canvas = document.createElement("canvas");
    canvas.width = cellSize;
    canvas.height = cellSize;
    const ctx = canvas.getContext("2d")!;

    const RATIO = 0.7;
    const innerW = cellSize * RATIO;
    const innerH = cellSize * RATIO;
    const gapX  = (cellSize * (1 - RATIO)) / 2;
    const gapY  = (cellSize * (1 - RATIO)) / 2;
    const innerX = gapX;
    const innerY = gapY;
    const e = Math.min(gapX, gapY) * 0.5;

    // // background
    // ctx.fillStyle = "#999";
    // ctx.fillRect(0, 0, cellSize, cellSize);

    // inner square
    ctx.fillStyle = color;
    ctx.fillRect(innerX, innerY, innerW, innerH);

    // shadow
    ctx.lineWidth = e;
    ctx.strokeStyle = "rgba(0,0,0,0.4)";
    ctx.beginPath();
    ctx.moveTo(innerX, innerY);
    ctx.lineTo(innerX + innerW, innerY);
    ctx.moveTo(innerX, innerY);
    ctx.lineTo(innerX, innerY + innerH);
    ctx.stroke();

    // highlight
    ctx.strokeStyle = "rgba(255,255,255,0.5)";
    ctx.beginPath();
    ctx.moveTo(innerX, innerY + innerH);
    ctx.lineTo(innerX + innerW, innerY + innerH);
    ctx.moveTo(innerX + innerW, innerY);
    ctx.lineTo(innerX + innerW, innerY + innerH);
    ctx.stroke();

    return canvas;
}
