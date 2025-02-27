import React from "react";
import "../../styles/menu.css";

type MenuState = "INIT" | "HOST" | "JOIN";

const Menu = () => {

    const createLobby = () => {
        
    }

    const joinGame = () => {

    }

    return (
        <>
            <div>
                <h1>SLIDE</h1>
            </div>
            <div className="buttons">
                <button onClick={createLobby}>CREATE LOBBY</button>
                <button onClick={joinGame}>JOIN GAME</button>
            </div>
        </>
    )
}

export default Menu;