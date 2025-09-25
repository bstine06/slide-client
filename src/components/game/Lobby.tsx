import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useAppState } from "../../context/StateContext";
import { deleteGame, leaveGame } from "../../api/GameAPI";
import { useGameState } from "../../context/GameContext";
import GameContainer from "./gameplay/GameContainer";

const Lobby: React.FC = () => {
    const { appState, setAppState } = useAppState();
    const { token, username } = useAuth();
    const { currentGame, readyUp } = useGameState();

    const handleReady = () => {
        if (!token || !currentGame || !username) return;
        readyUp(!currentGame.players[username]?.ready); // notify server
    };

    const handleLeave = async () => {
        if (!token) return;

        try {
            if (currentGame?.hostUsername === username) {
                console.log("Attempting to delete game");
                await deleteGame(token);
            } else {
                console.log("Attempting to leave game");
                await leaveGame(token);
            }
            setAppState("MENU");
        } catch (error) {
            console.error("Failed to exit game", error);
            alert("Failed to exit game: " + error);
        }
    };

    const renderPlayers = () => {
        if (!currentGame) return null;

        return (
            <>
                {Object.values(currentGame.players).map((p) => (
                    <div key={p.username}>
                        <p>{p.username}</p>
                        <p>{p.ready ? "ready" : "not ready"}</p>
                    </div>
                ))}
            </>
        );
    };


    if (!currentGame) return <p>Loading game...</p>;

    return (
        <>
            <div>
                <h1>SLIDE</h1>
            </div>
            <div>
                <h3>Game Lobby</h3>
                <h5>Game ID: {currentGame.gameId}</h5>
            </div>
            { !currentGame.inProgress &&
                <>
                    <div className="players-list">{renderPlayers()}</div>
                    <button onClick={handleReady}>
                        {username && currentGame.players[username]?.ready
                            ? "Unready"
                            : "Ready up"}
                    </button>
                </>
            }
            <button onClick={handleLeave}>Leave</button>
        </>
    );
};

export default Lobby;
