import React, { useEffect, useState } from "react";
import GameCanvas from "./GameCanvas";
import { GameDto } from "../../../types/GameTypes";
import GameController from "./GameController";
import { GameContext, GameProvider } from "../../../context/GameContext";
import { startGameLoop } from "./GameLoop";
import { GameEngine } from "./GameEngine";
import MazeGenerator from "../MazeGenerator";

export const GameplayTest: React.FC = () => {
    // Minimal mock game state
    const mockGame: GameDto = {
        gameId: "4f46b22e-a347-411a-85dc-916b267f8094",
        hostUsername: "bstine06",
        inProgress: false,
        players: {
            "bstine06":
                {
                    username: "bstine06",
                    ready: false,
                    level: 0,
                    x: 1,
                    y: 1,
                    vx: 0,
                    vy: 0,
                    nextMove: null,
                    stopX: null,
                    stopY: null,
                    color: "#9999FF"
                },
        },
        mazes: [],
    };

    const [game, setGame] = useState<GameDto | null>(mockGame);
    const [engine] = useState(() => new GameEngine(mockGame, "bstine06"));
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        mockGame.mazes = MazeGenerator.generateMazeArray(25, 16, "SPARSE", 3);
        mockGame.players["bstine06"].x = mockGame.mazes[0].startX;
        mockGame.players["bstine06"].y = mockGame.mazes[0].startY;
        setLoading(false);
        startGameLoop(engine, setGame);
    }, [engine]);

    return (
        <>
        <h1>Canvas Test</h1>
        {!loading && game && <GameCanvas game={game} playerName="bstine06"/>}
        <GameController engine={engine} username="bstine06"/>
        </>
    );
};

export default GameplayTest;
