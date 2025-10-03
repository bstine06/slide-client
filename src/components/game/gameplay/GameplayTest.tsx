import React, { useEffect, useState } from "react";
import GameCanvas from "./GameCanvas";
import { GameDto } from "../../../types/GameTypes";
import GameController from "./GameController";
import { GameContext, GameProvider } from "../../../context/GameContext";
import { startGameLoop } from "./utils/GameLoop";
import { GameEngine } from "./utils/GameEngine";
import MazeGenerator from "./utils/MazeGenerator";

export const GameplayTest: React.FC = () => {
    // Minimal mock game state
    const mockGame: GameDto = {
        gameId: "00000000-0000-0000-0000-000000000000",
        hostUsername: "zen",
        phase: "IN_PROGRESS",
        players: {
            "zen":
                {
                    username: "zen",
                    ready: false,
                    level: 0,
                    x: 1,
                    y: 1,
                    vx: 0,
                    vy: 0,
                    nextMove: null,
                    stopX: null,
                    stopY: null,
                    color: "#9900FF",
                    angle: 0
                },
        },
        mazes: [],
        startTime: Date.now()
    };

    const [game, setGame] = useState<GameDto | null>(mockGame);
    const [engine] = useState(() => new GameEngine(mockGame, "zen"));
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        mockGame.mazes = MazeGenerator.generateMazeArray(25, 6, "DENSE", 3);
        mockGame.players["zen"].x = mockGame.mazes[0].startX;
        mockGame.players["zen"].y = mockGame.mazes[0].startY;
        setLoading(false);
        startGameLoop(engine, setGame);
    }, [engine]);

    return (
        <>
        {!loading && game && <GameCanvas game={game} playerName="zen"/>}
        <GameController engine={engine} username="zen"/>
        </>
    );
};

export default GameplayTest;
