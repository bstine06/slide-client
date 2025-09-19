export class GoalDrawable {

    constructor(
        public x: number, 
        public y: number,
        public w: number,
        public h: number,
        public color: string
    ) {}

    draw(context: CanvasRenderingContext2D) {
        context.fillStyle = this.color;
        context.fillRect(this.x+2, this.y+2, this.w-4, this.h-4);
    }

}