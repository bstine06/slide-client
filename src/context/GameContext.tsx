import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
    useRef,
} from "react";
import { GameDto } from "../types/GameTypes";
import { useAuth } from "./AuthContext";
import { useAppState } from "./StateContext";
import {
    GameWebSocketMessageType,
    PlayerNameOnlyPayload,
    PlayerReadyPayload,
    WebSocketMessage,
} from "../types/WebSocketMessageTypes";

type GameContextType = {
    currentGame: GameDto | null;
    setCurrentGame: (game: GameDto) => void;
    readyUp: (ready: boolean) => void;
    leave: () => void;
    loading: boolean;
};

export const GameContext = createContext<GameContextType | null>(null);

export const GameProvider = ({ children }: { children: ReactNode }) => {
    const [currentGame, setCurrentGame] = useState<GameDto | null>(null);
    const [loading, setLoading] = useState(true);
    const { currentGameId } = useAppState();
    const { username, token } = useAuth();
    const wsRef = useRef<WebSocket | null>(null);

    // Open WS when a gameId is set
    useEffect(() => {
        if (!currentGameId || !token) return;

        const ws = new WebSocket(
            `ws://localhost:8443/ws/game?token=${token}&gameId=${currentGameId}`
        );
        wsRef.current = ws;

        ws.onopen = () => {
            console.log("WebSocket connected for game:", currentGameId);
            setLoading(false);
        };

        // inside your ws.onmessage
        ws.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            const { type, payload, username } = msg;

            setCurrentGame((prevGame) => {
                if (!prevGame) return prevGame;

                switch (type) {
                    case "ERROR":
                        console.error(payload);
                        alert("Websocket error");
                        return prevGame;

                    case "PLAYER_READY":
                        return {
                            ...prevGame,
                            players: {
                                ...prevGame.players,
                                [payload.username]: {
                                    ...prevGame.players[payload.username],
                                    ready: payload.ready,
                                },
                            },
                        };

                    case "PLAYER_JOIN":
                        return {
                            ...prevGame,
                            players: {
                                ...prevGame.players,
                                [payload.username]: payload, // add or overwrite
                            },
                        };

                    case "PLAYER_MOVE":
                        return {
                            ...prevGame,
                            players: {
                                ...prevGame.players,
                                [payload.username]: {
                                    ...prevGame.players[payload.username],
                                    ...payload, // merge in new x/y/etc
                                },
                            },
                        };

                    case "PLAYER_LEAVE":
                        const updatedPlayers = { ...prevGame.players };
                        delete updatedPlayers[payload.username];
                        return {
                            ...prevGame,
                            players: updatedPlayers,
                        };

                    case "GAME_STATE":
                        return payload; // full state replaces everything

                    default:
                        console.warn("Unhandled WS message type:", type);
                        return prevGame;
                }
            });
        };

        ws.onclose = (event: CloseEvent) => {
            console.log("WebSocket closed for game:", currentGameId);
            switch (event.code) {
                case 1000:
                    alert(`Session closed: ${event.reason}`);
            }
        };

        return () => ws.close();
    }, [currentGameId, token]);

    const readyUp = (ready: boolean) => {
        try {
            const type: GameWebSocketMessageType = "PLAYER_READY";
            if (!username) throw new Error("username is not set");
            const payload: PlayerReadyPayload = { username, ready };
            const message: WebSocketMessage<PlayerReadyPayload> = {
                type,
                payload,
            };
            wsRef.current?.send(
                JSON.stringify({
                    type: "PLAYER_READY",
                    payload: { username, ready },
                })
            );
        } catch (error) {
            console.error(error);
        }
    };

    const leave = () => {
        try {
            const type: GameWebSocketMessageType = "PLAYER_LEAVE";
            if (!username) throw new Error("username is not set");
            const payload: PlayerNameOnlyPayload = { username };
            const message: WebSocketMessage<PlayerNameOnlyPayload> = {
                type,
                payload,
            };
            wsRef.current?.send(JSON.stringify(message));
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <GameContext.Provider
            value={{ currentGame, setCurrentGame, readyUp, leave, loading }}
        >
            {children}
        </GameContext.Provider>
    );
};

export const useGameState = () => {
    const context = useContext(GameContext);
    if (!context)
        throw new Error("useGameState must be used within a GameProvider");
    return context;
};
