import pathBmp from '../resources/p00000000.bmp';

export class PathDrawable {
  private img: HTMLImageElement;
  public loaded: boolean = false;
  public loadPromise: Promise<void>;

  constructor(
    public x: number,
    public y: number,
    public w: number,
    public h: number,
    public color: string
  ) {
    this.img = new Image();
    this.loadPromise = new Promise((resolve) => {
      this.img.onload = () => {
        this.loaded = true;
        resolve();
      };
    });
    this.img.src = pathBmp;
  }

  // Async draw: wait until image is loaded
  async draw(ctx: CanvasRenderingContext2D) {
    if (!this.loaded) {
      await this.loadPromise;
    }
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
  }
}
