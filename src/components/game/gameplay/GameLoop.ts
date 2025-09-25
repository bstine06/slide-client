import { GameDto } from "../../../types/GameTypes";
import { GameEngine } from "./GameEngine";

/**
 * Starts a game loop for the given engine.
 * Calls setRenderState with the latest engine state each frame.
 */
export function startGameLoop(
    engine: GameEngine,
    updateRenderState: (serverSnapshot: GameDto) => void
) {
    let lastTime = performance.now();

    const loop = () => {
        const now = performance.now();
        const delta = (now - lastTime) / 1000;
        lastTime = now;

        engine.update(delta);
        updateRenderState({ ...engine.getState() });

        requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
}



