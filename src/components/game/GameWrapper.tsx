import React from "react";
import Game from "./Game";
import { GameProvider } from "../../context/GameContext";

const GameWrapper : React.FC = () => {

    return (
        <GameProvider>
            <Game />
        </GameProvider>
    )

}

export default GameWrapper;