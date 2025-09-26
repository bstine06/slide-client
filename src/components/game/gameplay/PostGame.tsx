import React from "react";
import { useGameState } from "../../../context/GameContext";
import { Player } from "../../../types/GameTypes";
import { leaveGame } from "../../../api/GameAPI";
import { useAuth } from "../../../context/AuthContext";
import { useAppState } from "../../../context/StateContext";

const PostGame : React.FC = () => {

    const {currentGame} = useGameState();
    const {token} = useAuth();
    const {setAppState} = useAppState();

    const renderResults = () => {
        if (!currentGame) return
        const orderedPlayers = Object.entries(currentGame.players).sort(
            (a, b) => {
                if (a[1].level > b[1].level) return -1
                if (a[1].level < b[1].level) return 1
                return 0
            }
        );
        return orderedPlayers.map(
            (p) => {
                return createJsxForPlayer(p);
            }
        );
    }

    const createJsxForPlayer = (p: [string, Player]) => {
        return (
            <div style={{display: "flex", justifyContent: "space-between", gap: "10px"}}>
                <div style={{height:"20px", width:"20px", backgroundColor:`${p[1].color}`}}></div>
                <h3>{p[0]}</h3>
                <p>{p[1].level}</p>
            </div>
        )
    }

    const handleLeaveGame = async () => {
        if (!token) return;
        await leaveGame(token);
        setAppState("MENU");
    }

    return (
        <>
            <h1>results</h1>
            {renderResults()}
            <div className="buttons">
                <button onClick={handleLeaveGame}>Leave Game</button>
            </div>
        </>
    )
}

export default PostGame;