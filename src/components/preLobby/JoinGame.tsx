import React, { useState } from "react";
import { useAppState } from "../../context/StateContext";
import { useAuth } from "../../context/AuthContext";
import { getGameById, joinGame } from "../../api/GameAPI";
import { GameDto } from "../../types/GameTypes";

const JoinGame : React.FC = () => {

    const [input, setInput] = useState<string>("");
    const [errorMsg, setErrorMsg] = useState<string>("");
    const {setCurrentGameId, setAppState} = useAppState();
    const {token} = useAuth();

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInput(event.target.value);
    };

    const handleSubmit = async () => {
        try {
            if (!token) throw new Error("Invalid user credentials");
            const game : GameDto = (await getGameById(input, token)).content;
            await joinGame(game.gameId, token);
            setCurrentGameId(game.gameId);
            setAppState("GAME");
        } catch (error) {
            console.error("Error fetching game: ", error);
            setErrorMsg("invalid game id");
        }
    }


    return (
        <>
            <h1>Join Game</h1>
            <h3>Enter game id:</h3>
            <input type="text" onChange={handleInputChange}></input>
            <button type="button" onClick={handleSubmit}>Join</button>
            {errorMsg && <p>{errorMsg}</p>}
        </>
    )

}

export default JoinGame;