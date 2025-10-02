export interface Maze {
  startX: number;
  startY: number;
  finishX: number;
  finishY: number;
  board: number[][]; // 2D array of ints
  theme: MazeTheme;
}

export type MazeTheme = "SEWER"

export interface CreateGamePayload {
  mazes: Maze[];
}

export interface ResponseDto<T> {
    message: string;
    content: T
}

export type GamePhase = "PRE_GAME" | "IN_PROGRESS" | "POST_GAME";

export interface GameDto {
    gameId: string;
    hostUsername: string;
    phase: GamePhase;
    players: Record<string, Player>;
    mazes: Maze[];
    startTime: number;
}

export type DirectionNonNull = "RIGHT" | "LEFT" | "DOWN" | "UP"
export type Direction = DirectionNonNull | null;

export interface Player {
    username: string;
    ready: boolean;
    level: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    nextMove: Direction;
    angle: number;
    stopX: number | null;
    stopY: number | null;
    color: string;
}