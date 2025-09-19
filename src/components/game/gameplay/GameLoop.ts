// GameLoop.ts
import { GameEngine } from "./GameEngine";
import { GameDto } from "../../../types/GameTypes";

export function startGameLoop(
  engine: GameEngine,
  onFrame: (state: GameDto) => void
) {
  let lastTime = performance.now();

  function loop(now: number) {
    const delta = (now - lastTime) / 1000; // seconds
    lastTime = now;

    engine.update(delta);
    onFrame(engine.getState());

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
}
