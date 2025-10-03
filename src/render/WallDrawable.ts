// --- Imports for all 16 patterns ---
import w0000bmp from "../resources/w0000.bmp";
import w0001bmp from "../resources/w0001.bmp";
import w0010bmp from "../resources/w0010.bmp";
import w0011bmp from "../resources/w0011.bmp";
import w0100bmp from "../resources/w0100.bmp";
import w0101bmp from "../resources/w0101.bmp";
import w0110bmp from "../resources/w0110.bmp";
import w0111bmp from "../resources/w0111.bmp";
import w1000bmp from "../resources/w1000.bmp";
import w1001bmp from "../resources/w1001.bmp";
import w1010bmp from "../resources/w1010.bmp";
import w1011bmp from "../resources/w1011.bmp";
import w1100bmp from "../resources/w1100.bmp";
import w1101bmp from "../resources/w1101.bmp";
import w1110bmp from "../resources/w1110.bmp";
import w1111bmp from "../resources/w1111.bmp";

export class WallDrawable {
    static images: Record<string, HTMLImageElement> = {};
    static loaded = false;
    static loadPromise: Promise<void>;
    static sources: Record<string, string> = {
        w0000: w0000bmp,
        // w0001: w0001bmp,
        // w0010: w0010bmp,
        // w0011: w0011bmp,
        // w0100: w0100bmp,
        // w0101: w0101bmp,
        // w0110: w0110bmp,
        w0111: w0111bmp,
        // w1000: w1000bmp,
        // w1001: w1001bmp,
        // w1010: w1010bmp,
        // w1011: w1011bmp,
        // w1100: w1100bmp,
        // w1101: w1101bmp,
        // w1110: w1110bmp,
        // w1111: w1111bmp,
    };

    constructor(
        public x: number,
        public y: number,
        public w: number,
        public h: number
    ) {}

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
                    })
            )
        ).then(() => {
            this.loaded = true;
        });
        return this.loadPromise;
    }

    draw(ctx: CanvasRenderingContext2D, wallType: string) {
        if (!WallDrawable.loaded) {
            throw new Error(
                "Assets for Wall Drawable were not loaded before draw"
            );
        }
        const img = WallDrawable.images[wallType] ?? null;
        ctx.imageSmoothingEnabled = false;
        img && ctx.drawImage(img, this.x, this.y, this.w, this.h);
    }
}
