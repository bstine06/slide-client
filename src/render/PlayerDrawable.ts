import rat00bmp from "../resources/rat00.bmp";
import rat01bmp from "../resources/rat01.bmp";
import rat02bmp from "../resources/rat02.bmp";
import rat03bmp from "../resources/rat03.bmp";
import ratframe00bmp from "../resources/ratframe00.bmp";
import ratframe01bmp from "../resources/ratframe01.bmp";
import ratframe02bmp from "../resources/ratframe02.bmp";
import ratframe03bmp from "../resources/ratframe03.bmp";

export class PlayerDrawable {
    static loaded = false;
    static loadPromise: Promise<void> | null = null;
    static spriteSources: Record<string, string> = {
        rat00: rat00bmp,
        rat01: rat01bmp,
        rat02: rat02bmp,
        rat03: rat03bmp,
    };
    static spriteOutlineSources: Record<string, string> = {
        ratframe00: ratframe00bmp,
        ratframe01: ratframe01bmp,
        ratframe02: ratframe02bmp,
        ratframe03: ratframe03bmp,
    };
    static spriteFrames: HTMLImageElement[] = [];
    static spriteOutlineFrames: HTMLImageElement[] = [];

    private playerFrames: HTMLImageElement[] = [];

    constructor(
        public x: number,
        public y: number,
        public w: number,
        public h: number,
        public color: string
    ) {
        if (!PlayerDrawable.loaded) {
            throw new Error(
                "Assets for Player Drawable were not loaded before draw."
            );
        }

        // create tinted frames for this player, and overlay outline frames
        this.playerFrames = PlayerDrawable.spriteFrames.map((img, i) => {
            const tinted = PlayerDrawable.tintImage(img, color, w, h);

            const canvas = document.createElement("canvas");
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext("2d")!;

            // draw tinted base
            ctx.drawImage(tinted, 0, 0, w, h);

            // draw outline on top
            ctx.drawImage(PlayerDrawable.spriteOutlineFrames[i], 0, 0, w, h);

            const combined = new Image();
            combined.src = canvas.toDataURL();
            return combined;
        });
    }

    static async preLoadAssets(): Promise<void> {
        if (this.loaded) return;
        if (this.loadPromise) return this.loadPromise;

        this.spriteFrames = Object.values(this.spriteSources).map((src) => {
            const img = new Image();
            img.src = src;
            return img;
        });

        this.spriteOutlineFrames = Object.values(this.spriteOutlineSources).map(
            (src) => {
                const img = new Image();
                img.src = src;
                return img;
            }
        );

        const allImages = [...this.spriteFrames, ...this.spriteOutlineFrames];

        this.loadPromise = Promise.all(
            allImages.map(
                (img) =>
                    new Promise<void>((resolve) => {
                        img.onload = () => resolve();
                        img.onerror = () => resolve(); // fail-soft
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
): HTMLCanvasElement {   // <-- return canvas, not HTMLImageElement
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

    return canvas; // no async decoding step needed
}

    draw(
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        w: number,
        h: number,
        frame: number,
        isMoving: boolean,
        angle: number
    ) {
        const img = this.playerFrames[isMoving ? frame % 4 : 0];
        ctx.save();
        ctx.imageSmoothingEnabled = false;

        ctx.translate(x + w / 2, y + h / 2);
        ctx.rotate(angle);

        ctx.drawImage(img, -w / 2, -h / 2, w, h);
        ctx.restore();
    }
}
