import React, { useEffect, useRef } from "react";
import { renderGame, eraseCaches } from "../../../render/Renderer";
import { GameDto } from "../../../types/GameTypes";

interface GameCanvasProps {
    game: GameDto;
    playerName: string;
}

const GameCanvas : React.FC<GameCanvasProps> = ({game, playerName}) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const WIDTH = 400;
    const HEIGHT = 400;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext("2d");
        if (!context) return;

        renderGame(context, game, playerName);
    }, [game]);

    // separate unmount-only cleanup
    useEffect(() => {
        return () => {
            eraseCaches();
        };
    }, []); // empty deps = only on unmount

    return (
        <>
            <h1>Game Canvas</h1>
            <h2>
                {game.players[playerName]?.level}/{game.mazes.length! - 1}
            </h2>
            <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} />
        </>
    );
}

export default GameCanvas;