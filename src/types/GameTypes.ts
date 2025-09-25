export interface Maze {
  startX: number;
  startY: number;
  finishX: number;
  finishY: number;
  board: number[][]; // 2D array of ints
}

export interface CreateGamePayload {
  mazes: Maze[];
}

export interface ResponseDto<T> {
    message: string;
    content: T
}

export interface GameDto {
    gameId: string;
    hostUsername: string;
    inProgress: boolean;
    players: Record<string, Player>;
    mazes: Maze[];
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
    stopX: number | null;
    stopY: number | null;
    color: string;
}