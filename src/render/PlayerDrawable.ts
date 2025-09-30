
import rat00bmp from '../resources/rat00.bmp';
import rat01bmp from '../resources/rat01.bmp';
import rat02bmp from '../resources/rat02.bmp';
import rat03bmp from '../resources/rat03.bmp';

export class PlayerDrawable {
  private movementFrames: HTMLImageElement[] = [];
  public loaded = false;
  public loadPromise: Promise<void>;

  constructor(
    public x: number,
    public y: number,
    public w: number,
    public h: number,
  ) {
    // Key = "w" + 4-bit binary string
    const sources: Record<string, string> = {
      rat00: rat00bmp,
      rat01: rat01bmp,
      rat02: rat02bmp,
      rat03: rat03bmp
    };

    Object.values(sources).forEach((value, i) => {
      const img = new Image();
      img.src = value;
      this.movementFrames[i] = img;
    })

    this.loadPromise = Promise.all(
      Object.values(this.movementFrames).map(
        (img) =>
          new Promise<void>((resolve) => {
            img.onload = () => resolve();
            img.onerror = () => resolve();
          }),
      ),
    ).then(() => {
      this.loaded = true;
    });
  }

  async draw(ctx: CanvasRenderingContext2D, frame: number, isMoving: boolean, angle: number) {
    if (!this.loaded) {
      await this.loadPromise;
    }

    const img = this.movementFrames[isMoving ? frame % 4 : 0];
    ctx.save(); // <— save the current transform
    ctx.imageSmoothingEnabled = false;

    // Move origin to the center of the player before rotating
    ctx.translate(this.x + this.w / 2, this.y + this.h / 2);
    ctx.rotate(angle);

    // Draw the image centered
    ctx.drawImage(img, -this.w / 2, -this.h / 2, this.w, this.h);
    ctx.restore(); // <— restore to pre-rotation state
  }
}