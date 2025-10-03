// --- Imports for all 16 patterns ---
import p0000bmp from '../resources/p0000.bmp';
import p0001bmp from '../resources/p0001.bmp';
import p0002bmp from '../resources/p0002.bmp';

export class PathDrawable {
  static images: Record<string, HTMLImageElement> = {};
  static loaded = false;
  static loadPromise: Promise<void>;

  static sources: Record<string, string> = {
      p0000: p0000bmp,
      p0001: p0001bmp,
      p0002: p0002bmp,
    };

  constructor(
    public x: number,
    public y: number,
    public w: number,
    public h: number,
  ) {
  }

  static async preLoadAssets() : Promise<void> {

    if (this.loaded) return; // already done
    if (this.loadPromise) return this.loadPromise; // already in progress

    for (const [key, src] of Object.entries(this.sources)) {
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
    return this.loadPromise;
  }

  public draw(ctx: CanvasRenderingContext2D, pathType: string) {
    if (!PathDrawable.loaded) {
      throw new Error("Assets for Path Drawable were not loaded before draw");
    }
    const img = PathDrawable.images[pathType] ?? PathDrawable.images.p0000;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img, this.x, this.y, this.w, this.h);
  }
}
