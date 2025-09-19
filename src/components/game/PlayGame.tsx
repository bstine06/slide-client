import React, { useEffect } from "react";
import { useGameState } from "../../context/GameContext";
import GameCanvas from "./gameplay/GameCanvas";

const PlayGame : React.FC = () => {

    const { currentGame } = useGameState();

    return (
        <>
            <h1>Play Game</h1>
        </>
    )

}

export default PlayGame;