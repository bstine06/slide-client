import rat00bmp from '../resources/rat00.bmp';
import rat01bmp from '../resources/rat01.bmp';
import rat02bmp from '../resources/rat02.bmp';
import rat03bmp from '../resources/rat03.bmp';

export class PlayerDrawable {
  static loaded = false;
  static loadPromise: Promise<void> | null = null;
  static sources: Record<string, string> = {
    rat00: rat00bmp,
    rat01: rat01bmp,
    rat02: rat02bmp,
    rat03: rat03bmp,
  };
  static staticFrames: HTMLImageElement[] = [];

  private playerFrames: HTMLImageElement[] = [];

  constructor(
    public x: number,
    public y: number,
    public w: number,
    public h: number,
    public color: string
  ) {
    if (!PlayerDrawable.loaded) {
      throw new Error("Assets for Player Drawable were not loaded before draw.");
    }

    // create tinted frames for this player
    this.playerFrames = PlayerDrawable.staticFrames.map(
      (img) => PlayerDrawable.tintImage(img, color, w, h)
    );
  }

  static async preLoadAssets(): Promise<void> {
    if (this.loaded) return;
    if (this.loadPromise) return this.loadPromise;

    this.staticFrames = Object.values(this.sources).map((src) => {
      const img = new Image();
      img.src = src;
      return img;
    });

    this.loadPromise = Promise.all(
      this.staticFrames.map(
        (img) =>
          new Promise<void>((resolve) => {
            img.onload = () => resolve();
            img.onerror = () => resolve(); // resolve anyway
          })
      )
    ).then(() => {
      this.loaded = true;
    });

    return this.loadPromise;
  }

  static tintImage(
    img: HTMLImageElement,
    color: string,
    w: number,
    h: number
  ): HTMLImageElement {
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d")!;

    // Draw the original image
    ctx.drawImage(img, 0, 0, w, h);

    // Apply color overlay using "source-in"
    ctx.globalCompositeOperation = "source-in";
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, w, h);

    // Convert back to HTMLImageElement
    const tinted = new Image();
    tinted.src = canvas.toDataURL();
    return tinted;
  }

draw(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, frame: number, isMoving: boolean, angle: number) {
    const img = this.playerFrames[isMoving ? frame % 4 : 0];
    ctx.save();
    ctx.imageSmoothingEnabled = false;

    ctx.translate(x + w / 2, y + h / 2);
    ctx.rotate(angle);

    ctx.drawImage(img, -w / 2, -h / 2, w, h);
    ctx.restore();
}

}
