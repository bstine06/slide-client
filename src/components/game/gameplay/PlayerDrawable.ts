export class PlayerDrawable {

    constructor(
        public x: number, 
        public y: number,
        public w: number,
        public h: number,
        public color: string
    ) {}

    draw(context: CanvasRenderingContext2D) {
        context.fillStyle = "white"
        context.fillRect(this.x, this.y, this.w , this.h );
        context.fillStyle = this.color;
        context.fillRect(this.x + 2, this.y + 2, this.w - 4, this.h - 4);
    }

}