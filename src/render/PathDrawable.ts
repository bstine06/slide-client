// --- Imports for all 16 patterns ---
import p0000bmp from '../resources/p0000.bmp';
import p0001bmp from '../resources/p0001.bmp';
import p0002bmp from '../resources/p0002.bmp';

export class PathDrawable {
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
      p0000: p0000bmp,
      p0001: p0001bmp,
      p0002: p0002bmp,
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

  async draw(ctx: CanvasRenderingContext2D, pathType: string) {
    if (!this.loaded) {
      await this.loadPromise;
    }
    const img = this.images[pathType] ?? this.images.p0000;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img, this.x, this.y, this.w, this.h);
  }
}
