
import cheesebmp from '../resources/cheese.bmp';

export class GoalDrawable {
  private images: Record<string, HTMLImageElement> = {};
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
      cheese: cheesebmp,
    };

    for (const [key, src] of Object.entries(sources)) {
      const img = new Image();
      img.src = src;
      this.images[key] = img;
    }

    this.loadPromise = Promise.all(
      Object.values(this.images).map(
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

  async draw(ctx: CanvasRenderingContext2D) {
    if (!this.loaded) {
      await this.loadPromise;
    }
    const img = this.images["cheese"];
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img, this.x, this.y, this.w, this.h);
  }
}