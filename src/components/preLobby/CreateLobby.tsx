import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useAppState } from "../../context/StateContext";
import { createGame, joinGame } from "../../api/GameAPI";
import { CreateGamePayload, Maze } from "../../types/GameTypes";
import MazeGenerator from "../game/MazeGenerator";

const CreateLobby: React.FC = () => {
    const { setAppState, setCurrentGameId } = useAppState();
    const { token, username } = useAuth();

    const [roundsCount, setRoundsCount] = useState<number>(5);

    const handleLeave = () => {
        // TODO: delete game on backend
        setAppState("MENU");
    };

    const handleCreateGame = async () => {
        try {
            if (token && username) {

                const DIMENSION = 10;

                const generatedMazes = MazeGenerator.generateMazeArray(
                    roundsCount, 
                    DIMENSION, 
                    "BIAS_DENSE_AND_SPARSE",
                    3);

                const createGamePayload : CreateGamePayload = {
                    mazes: generatedMazes
                };
                const createdGame = (await createGame(createGamePayload, token)).content;
                console.log("Game created: ", createdGame.gameId);

                setCurrentGameId(createdGame.gameId);

                // move into game branch after successful creation
                setAppState("GAME");
            }
        } catch (error) {
            console.error("Failed to create game", error);
        }
    };

    return (
        <div>
            <h1>CREATE GAME</h1>
            <h2># of rounds:</h2>
            <input
                type="number"
                value={roundsCount}
                onChange={(e) => setRoundsCount(parseInt(e.target.value, 10))}
            />
            <button onClick={handleCreateGame}>Create Game</button>
            <button onClick={handleLeave}>Cancel</button>
        </div>
    );
};

export default CreateLobby;
