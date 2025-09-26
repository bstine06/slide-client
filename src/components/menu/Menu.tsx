import React, { useEffect } from "react";
import "../../styles/menu.css";
import { useAppState } from "../../context/StateContext";
import { useAuth } from "../../context/AuthContext";
import { getUserProfile } from "../../api/UserAPI";

const Menu = () => {

    const { appState, setAppState } = useAppState();
    const { token, username, logout } = useAuth();

    useEffect(() => {
        console.log("in MENU");
        (async () => {
            try {
                if (token && username) {
                    const profile = await getUserProfile(username, token);
                    console.log("User profile:", profile);
                }
            } catch (error) {
                console.error("Failed to fetch user profile:", error);
            }
        })();
    }, [token])

    const createLobby = () => {
        setAppState("CREATE");
    }

    const joinGame = () => {
        setAppState("JOIN");
    }

    const goToCustomize = () => {
        setAppState("CUSTOMIZE");
    }

    const handleLogout = () => {
        logout();
        setAppState("LOGIN");
    }

    // TODO remove this once canvas is actually implemented
    const handleGameCanvasTest = () => {
        setAppState("GAMEPLAY_TEST");
    }

    return (
        <>
            <div>
                <h1>SLIDE</h1>
                <h2>{username}</h2>
            </div>
            <div className="buttons">
                <button onClick={createLobby}>CREATE LOBBY</button>
                <button onClick={joinGame}>JOIN GAME</button>
                <button onClick={goToCustomize}>CUSTOMIZE</button>

                {/* TODO remove this once canvas is actually implemented */}
                <button onClick={handleGameCanvasTest}>TEST GAMEPLAY (SOLO)</button>
                <button onClick={handleLogout}>LOG OUT</button>
            </div>
        </>
    )
}

export default Menu;