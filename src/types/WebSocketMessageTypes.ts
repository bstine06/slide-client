import { Direction } from "./GameTypes";

export type GameWebSocketMessageType =
    | "GAME_STATE"
    | "PLAYER_READY"
    | "PLAYER_LEAVE"
    | "GAME_START"
    | "PLAYER_UPDATE"
    | "ERROR"
    | "PLAYER_JOIN";

export interface WebSocketMessage<T> {
  type: GameWebSocketMessageType;
  payload: T;
}

export interface PlayerNameOnlyPayload {
    username: string;
}

export interface PlayerReadyPayload {
    username: string;
    ready: boolean;
}

export interface PlayerUpdatePayload {
    username: string;
    level: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    nextMove: Direction;
    angle: number;
    stopX: number;
    stopY: number;
}