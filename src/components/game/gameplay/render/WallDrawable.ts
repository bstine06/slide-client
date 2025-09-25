export class WallDrawable {

    constructor(
        public x: number,
        public y: number,
        public w: number,
        public h: number,
        public color: string
    ) {
    }

    draw(context: CanvasRenderingContext2D) {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.w , this.h );
    }
}
