// GameController.tsx
import { useEffect } from "react";
import { GameEngine } from "./GameEngine";

interface GameControllerProps {
  engine: GameEngine;
  username: string;
}

const GameController: React.FC<GameControllerProps> = ({ engine, username }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      console.log(e.key);
      switch (e.key) {
        case "ArrowLeft":
          engine.moveLeft(username);
          break;
        case "ArrowRight":
          engine.moveRight(username);
          break;
        case "ArrowUp":
          engine.moveUp(username);
          break;
        case "ArrowDown":
          engine.moveDown(username);
          break;
        case " ":
          engine.goToStart(username);
          break;
      }
    };

    // const handleKeyUp = (e: KeyboardEvent) => {
    //   if (["ArrowLeft", "ArrowRight"].includes(e.key)) {
    //     engine.getState().players[0].vx = 0;
    //   }
    //   if (["ArrowUp", "ArrowDown"].includes(e.key)) {
    //     engine.getState().players[0].vy = 0;
    //   }
    // };

    window.addEventListener("keydown", handleKeyDown);
    // window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    //   window.removeEventListener("keyup", handleKeyUp);
    };
  }, [engine]);

  return null; // doesn't render anything
};

export default GameController;

