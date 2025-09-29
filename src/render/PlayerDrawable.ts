export class PlayerDrawable {
    private RATIO = 0.7;
    private cache: HTMLCanvasElement;

    constructor(
        public x: number,
        public y: number,
        public w: number,
        public h: number,
        public color: string
    ) {
        this.cache = this.buildCache();
    }

    // Draw the static embossed square to an offscreen canvas
    private buildCache(): HTMLCanvasElement {
        const canvas = document.createElement("canvas");
        canvas.width = this.w;
        canvas.height = this.h;
        const ctx = canvas.getContext("2d")!;
        
        const innerW = this.w * this.RATIO;
        const innerH = this.h * this.RATIO;
        const gapX  = (this.w * (1 - this.RATIO)) / 2;
        const gapY  = (this.h * (1 - this.RATIO)) / 2;
        const innerX = gapX;
        const innerY = gapY;
        const e = Math.min(gapX, gapY) * 0.5;

        // "backgound"
        // ctx.fillStyle = "#999";
        // ctx.fillRect(0, 0, this.w, this.h);

        ctx.fillStyle = this.color;
        ctx.fillRect(innerX, innerY, innerW, innerH);

        ctx.lineWidth = e;

        // Highlight
        ctx.strokeStyle = "rgba(255,255,255,0.5)";
        ctx.beginPath();
        ctx.moveTo(innerX, innerY);
        ctx.lineTo(innerX + innerW, innerY);
        ctx.moveTo(innerX, innerY);
        ctx.lineTo(innerX, innerY + innerH);
        ctx.stroke();

        // Shadow
        ctx.strokeStyle = "rgba(0,0,0,0.4)";
        ctx.beginPath();
        ctx.moveTo(innerX, innerY + innerH);
        ctx.lineTo(innerX + innerW, innerY + innerH);
        ctx.moveTo(innerX + innerW, innerY);
        ctx.lineTo(innerX + innerW, innerY + innerH);
        ctx.stroke();

        return canvas;
    }

    // Now the draw method is trivial
    draw(context: CanvasRenderingContext2D) {
        context.drawImage(this.cache, this.x, this.y);
    }
}
