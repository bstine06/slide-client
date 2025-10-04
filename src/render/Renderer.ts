import { PlayerDrawable } from "./PlayerDrawable";
import { GameDto } from "../types/GameTypes";
import { buildWallLayer } from "./WallLayer";
import { buildAnimatedLayer } from "./AnimatedLayer";
import { buildPathLayer } from "./PathLayer";
import { PathDrawable } from "./PathDrawable";
import { WallDrawable } from "./WallDrawable";

let wallLayerCaches: HTMLCanvasElement[] = [];
let backgroundLayerCaches: HTMLCanvasElement[][] = [];
let pathLayerCaches: HTMLCanvasElement[] = [];
let playerDrawables: Map<string, PlayerDrawable[]> = new Map();

let lastTime = performance.now();
let elapsed = 0;

interface ViewportTransition {
    active: boolean;
    fromLevel: number;
    toLevel: number;
    startTime: number;
    duration: number;
}

let viewportTransition: ViewportTransition = {
    active: false,
    fromLevel: 0,
    toLevel: 0,
    startTime: 0,
    duration: 200,
};

let lastFramePlayerLevel = 0;

export async function renderGame(
    context: CanvasRenderingContext2D,
    game: GameDto,
    playerName: string
) {
    if (wallLayerCaches.length === 0) throw new Error("Graphics cache (wallLayer) not loaded");
    if (backgroundLayerCaches.length === 0) throw new Error("Graphics cache (backgroundLayer) not loaded");
    if (pathLayerCaches.length === 0) throw new Error("Graphics cache (pathLayer) not loaded");
    if (playerDrawables.size === 0) throw new Error("Player Drawables not loaded");

    const canvas = context.canvas;
    const player = game.players[playerName];
    const board = game.mazes[player.level].board;
    const cellSize = canvas.width / board[0].length;

    // Trigger viewport transition if player advanced
    if (lastFramePlayerLevel !== player.level) {
        viewportTransition = {
            active: true,
            fromLevel: lastFramePlayerLevel,
            toLevel: player.level,
            startTime: performance.now(),
            duration: 200,
        };
        lastFramePlayerLevel = player.level;
    }

    const now = performance.now();
    elapsed += (now - lastTime) / 1000;
    lastTime = now;
    const frameDuration = 0.1; // seconds per frame
    const frame = Math.floor(elapsed / frameDuration) % 16;

    // Clear canvas
    context.fillStyle = "#333";
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Compute effective level
    let effectiveLevel = player.level;
    let progress = 1;
    if (viewportTransition.active) {
        progress = Math.min(1, (now - viewportTransition.startTime) / viewportTransition.duration);
        effectiveLevel =
            viewportTransition.fromLevel +
            (viewportTransition.toLevel - viewportTransition.fromLevel) * progress;
        if (progress >= 1) viewportTransition.active = false;
    }

    // Background uses current target level
    const bgFrameIndex = Math.min(player.level, backgroundLayerCaches.length - 1);
    context.drawImage(backgroundLayerCaches[bgFrameIndex][frame], 0, 0);

    const maxPrevious = 3;
    const startLevel = Math.max(0, Math.floor(effectiveLevel) - maxPrevious);
    const endLevel = Math.ceil(effectiveLevel);

    for (let l = startLevel; l <= endLevel; ++l) {
        // Per-level fade alpha
        let alpha = Math.pow(0.4, effectiveLevel - l);

        // If transitioning, fade out the old level, fade in the new
        if (viewportTransition.active) {
            if (l === viewportTransition.toLevel) {
                alpha *= progress; // fade in new
            }
        }

        const scale = Math.pow(0.92, effectiveLevel - l);
        const w = canvas.width * scale;
        const h = canvas.height * scale;
        const offsetX = (canvas.width - w) / 2;
        const offsetY = (canvas.height - h) / 2;

        context.save();
        context.globalAlpha = alpha;

        // Draw wall and path
        context.drawImage(wallLayerCaches[l], offsetX, offsetY, w, h);
        context.drawImage(pathLayerCaches[l], offsetX, offsetY, w, h);

        // Draw other players
        Object.values(game.players).forEach((p) => {
            if (p.level === l && p.username !== playerName) {
                const isMoving = p.vx + p.vy !== 0;
                const px = offsetX + p.x * (w / board[0].length);
                const py = offsetY + p.y * (h / board.length);

                playerDrawables.get(p.username)![l].draw(
                    context,
                    px,
                    py,
                    cellSize * scale,
                    cellSize * scale,
                    frame,
                    isMoving,
                    p.angle
                );
            }
        });

        context.restore();
    }

    // Draw the current player with interpolated scale and alpha
    const interpScale = Math.pow(0.92, effectiveLevel - player.level);
    const w = canvas.width * interpScale;
    const h = canvas.height * interpScale;
    const offsetX = (canvas.width - w) / 2;
    const offsetY = (canvas.height - h) / 2;

    let playerAlpha = 1;
    if (viewportTransition.active && player.level === viewportTransition.toLevel) {
        playerAlpha = progress; // fade in player
    }

    const isMoving = player.vx + player.vy !== 0;
    context.save();
    context.globalAlpha = playerAlpha;
    playerDrawables.get(playerName)![player.level].draw(
        context,
        offsetX + player.x * (w / board[0].length),
        offsetY + player.y * (h / board.length),
        cellSize * interpScale,
        cellSize * interpScale,
        frame,
        isMoving,
        player.angle
    );
    context.restore();
}

export function eraseCaches(): void {
    wallLayerCaches = [];
    backgroundLayerCaches = [];
    pathLayerCaches = [];
}

export async function buildCaches(
    context: CanvasRenderingContext2D,
    game: GameDto
): Promise<void> {
    await PathDrawable.preLoadAssets();
    await PlayerDrawable.preLoadAssets();
    await WallDrawable.preLoadAssets();

    for (let l = 0; l < game.mazes.length; ++l) {
        const canvas = context.canvas;
        const maze = game.mazes[l];
        const board = maze.board;
        const cellSize = canvas.width / board[0].length;

        Object.values(game.players).forEach((p) => {
            if (!playerDrawables.has(p.username)) playerDrawables.set(p.username, []);
            playerDrawables.get(p.username)![l] = new PlayerDrawable(
                p.x * cellSize,
                p.y * cellSize,
                cellSize,
                cellSize,
                p.color
            );
        });

        wallLayerCaches[l] = buildWallLayer(board, cellSize);
        backgroundLayerCaches[l] = buildAnimatedLayer(board, cellSize);
        pathLayerCaches[l] = buildPathLayer(board, cellSize, maze.theme);
    }
}
