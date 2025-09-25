import React, { useEffect, useState } from "react";
import GameCanvas from "./GameCanvas";
import { GameDto } from "../../../types/GameTypes";
import GameController from "./GameController";
import { useGameState } from "../../../context/GameContext";
import { startGameLoop } from "./GameLoop";
import { GameEngine } from "./GameEngine";
import { useAuth } from "../../../context/AuthContext";

export const GameContainer: React.FC = () => {

    const {currentGame, updatePlayer }  = useGameState();
    const {username} = useAuth();
    
    const [engine, setEngine] = useState<GameEngine | null>(null);
    const [renderState, setRenderState] = useState<GameDto | null>(currentGame);

    useEffect(() => {
        if (currentGame && !engine && username) {
            const newEngine = new GameEngine(currentGame, username);

            // Hook player updates to send WS messages
            newEngine.onPlayerUpdate(updatePlayer);

            setEngine(newEngine);
            setRenderState(currentGame);

            // Start the game loop using our reusable function
            startGameLoop(newEngine, setRenderState);
        }
    }, [currentGame, username, engine, updatePlayer]);

    useEffect(() => {
        if (!currentGame || !engine || !username) return;

        engine.updateOtherPlayers(currentGame.players, username);
    }, [currentGame, engine, username]);

    if (!renderState || !username) return <h1>Loading...</h1>;

    return (
        <>
            <h1>Game Container</h1>
            {currentGame && username && <GameCanvas game={renderState} playerName={username}/>}
            {engine && username && <GameController engine={engine} username={username}/>}
        </>
    );
};

export default GameContainer;
