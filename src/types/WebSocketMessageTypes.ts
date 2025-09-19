export type GameWebSocketMessageType =
    | "GAME_STATE"
    | "PLAYER_READY"
    | "PLAYER_LEAVE"
    | "PLAYER_MOVE"
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

export interface PlayerMovePayload {
    username: string;
    x: number;
    y: number;
}