import React, { useEffect } from "react";
import { GameProvider, useGameState } from "../../context/GameContext";
import Lobby from "./Lobby";
import PlayGame from "./PlayGame";
import { useAuth } from "../../context/AuthContext";
import { getGame, joinGame } from "../../api/GameAPI";
import { useAppState } from "../../context/StateContext";
import { GameDto } from "../../types/GameTypes";

const Game = () => {

    const {currentGame, setCurrentGame} = useGameState();
    const {currentGameId, setCurrentGameId} = useAppState();
    const { token } = useAuth();

    useEffect(() => {
        if (!token) return;

        const loadGame = async () => {
            if (currentGame) return;
            try {
                console.log("Fetching current game by username");
                const gameResponse: GameDto = (await getGame(token)).content;
                setCurrentGame(gameResponse);
                setCurrentGameId(gameResponse.gameId);
            } catch (error) {
                console.error("Failed to load game:", error);
            }
        };

        loadGame();
    }, [token, currentGameId, currentGame]);


    return (
        <>
            <p>GAME</p>
            {currentGame?.inProgress === false && <Lobby />}
            {currentGame?.inProgress === true && <PlayGame />}
        </>
    )
}

export default Game;