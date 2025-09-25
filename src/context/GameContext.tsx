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
    PlayerNameOnlyPayload,
    PlayerReadyPayload,
    PlayerUpdatePayload,
    WebSocketMessage,
} from "../types/WebSocketMessageTypes";

type GameContextType = {
    currentGame: GameDto | null;
    setCurrentGame: (game: GameDto) => void;
    readyUp: (ready: boolean) => void;
    leave: () => void;
    loading: boolean;
    updatePlayer: (update: PlayerUpdatePayload) => void;
};

export const GameContext = createContext<GameContextType | null>(null);

export const GameProvider = ({ children }: { children: ReactNode }) => {
    const [currentGame, setCurrentGame] = useState<GameDto | null>(null);
    const [loading, setLoading] = useState(true);
    const { currentGameId } = useAppState();
    const { username, token } = useAuth();
    const wsRef = useRef<WebSocket | null>(null);

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

        ws.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            const { type, payload } = msg;

            if (type === "PONG") {
                // server echoes clientSend back in payload
                const clientSend = payload.clientSend;
                const clientReceive = Date.now();
                const roundTrip = clientReceive - clientSend;
                return;
            }

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
                                [payload.username]: payload,
                            },
                        };

                    case "PLAYER_UPDATE":
                        const prevPlayers = prevGame.players;
                        const newPlayers = { ...prevPlayers };

                        newPlayers[payload.username] = {
                            ...prevPlayers[payload.username], // old state
                            ...payload, // merge new
                        };

                        return {
                            ...prevGame,
                            players: newPlayers,
                        };

                    case "PLAYER_LEAVE":
                        const updatedPlayers = { ...prevGame.players };
                        delete updatedPlayers[payload.username];
                        return {
                            ...prevGame,
                            players: updatedPlayers,
                        };

                    case "GAME_START":
                        return { ...payload };

                    case "GAME_STATE":
                        return { ...payload };

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

        return () => {
            ws.close();
        };
    }, [currentGameId, token]);

    const readyUp = (ready: boolean) => {
        try {
            if (!username) throw new Error("username is not set");
            const message: WebSocketMessage<PlayerReadyPayload> = {
                type: "PLAYER_READY",
                payload: { username, ready },
            };
            wsRef.current?.send(JSON.stringify(message));
        } catch (error) {
            console.error(error);
        }
    };

    const leave = () => {
        try {
            if (!username) throw new Error("username is not set");
            const message: WebSocketMessage<PlayerNameOnlyPayload> = {
                type: "PLAYER_LEAVE",
                payload: { username },
            };
            wsRef.current?.send(JSON.stringify(message));
        } catch (error) {
            console.error(error);
        }
    };

    const updatePlayer = (update: PlayerUpdatePayload) => {
        try {
            if (!username) throw new Error("username is not set");
            if (username !== update.username)
                throw new Error("username in player update does not match authenticated username");
            const message: WebSocketMessage<PlayerUpdatePayload> = {
                type: "PLAYER_UPDATE",
                payload: update
            };
            wsRef.current?.send(JSON.stringify(message));
        } catch (error) {
            console.error(error);
            console.error(update.username);
            console.error(username);
        }
    }

    return (
        <GameContext.Provider
            value={{ currentGame, setCurrentGame, readyUp, leave, loading, updatePlayer }}
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
