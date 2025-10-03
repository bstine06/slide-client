import React, { useEffect, useRef, useState } from "react";
import { renderGame, eraseCaches, buildCaches } from "../../../render/Renderer";
import { GameDto } from "../../../types/GameTypes";

interface GameCanvasProps {
    game: GameDto;
    playerName: string;
}

const GameCanvas : React.FC<GameCanvasProps> = ({game, playerName}) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const WIDTH = 400;
    const HEIGHT = 400;

    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext("2d");
        if (!context) return;
        if (loading) return;

        renderGame(context, game, playerName);
    }, [game, loading]);

    useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let canceled = false;

    const setupCaches = async () => {
        await buildCaches(ctx, game); // only runs once per maze structure
        if (canceled) return;
        setLoading(false);
    };

    setupCaches();

    return () => {
        canceled = true;
        eraseCaches();
    };
}, [game.mazes]); // only rebuild if maze layouts change

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