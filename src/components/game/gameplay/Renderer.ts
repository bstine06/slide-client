import { PlayerDrawable } from "./PlayerDrawable";
import { GameDto, Player } from "../../../types/GameTypes";
import { WallDrawable } from "./WallDrawable";
import { GoalDrawable } from "./GoalDrawable";

export function renderGame(context: CanvasRenderingContext2D, game: GameDto, playerName: string) {
  // clear
  const canvas = context.canvas;
  context.fillStyle = "#888";
  context.fillRect(0, 0, canvas.width, canvas.height);

  // --- Draw maze ---
  const mazeDimension = game.mazes[game.players[playerName].level].board[0].length
  const cellSize = canvas.width/mazeDimension; // adjust for your canvas size & maze dimensions
  let player = game.players[playerName];
  if (player === undefined) {
    console.error("player is undefined");
    alert("player is undefined");
    return;
  }
  const maze = game.mazes[player.level].board; // assuming first maze is the one you want

  if (maze) {
    for (let row = 0; row < maze.length; row++) {
      for (let col = 0; col < maze[row].length; col++) {
        if (maze[row][col] === 1) {
          const drawable = new WallDrawable(col * cellSize, row * cellSize, cellSize, cellSize, "#222");
          drawable.draw(context);
        }
        if (maze[row][col] === 3) {
          const drawable = new GoalDrawable(col * cellSize, row * cellSize, cellSize, cellSize, "green");
          drawable.draw(context);
        }
      }
    }
  }

  // draw players
  Object.values(game.players).forEach(p => {
    const drawable = new PlayerDrawable(p.x * cellSize, p.y * cellSize, cellSize, cellSize, "red");
    drawable.draw(context);
  });
}
