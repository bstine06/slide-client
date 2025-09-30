import React, { useEffect } from "react";
import "./style.css";
import Login from "./components/authenticate/Login";
import Register from "./components/authenticate/Register";
import Menu from "./components/menu/Menu";
import Game from "./components/game/Game";

import { useAuth } from "./context/AuthContext";
import { useAppState } from "./context/StateContext";
import CreateLobby from "./components/preLobby/CreateLobby";
import Preload from "./components/load/Preload";
import JoinGame from "./components/preLobby/JoinGame";
import { GameplayTest } from "./components/game/gameplay/GameplayTest";
import Customize from "./components/menu/Customize";
import { GameProvider } from "./context/GameContext";


const App: React.FC = () => {

    const { isAuthenticated } = useAuth();
    const { appState } = useAppState();

    return (
        <>
            {appState === "PRELOAD" && <Preload />}
            {appState === "LOGIN" && <Login />}
            {appState === "REGISTER" && <Register/ >}
            {appState === "MENU" && <Menu />}
            {appState === "CUSTOMIZE" && <Customize />}
            {appState === "CREATE" && <CreateLobby />}
            {appState === "JOIN" && <JoinGame />}
            {appState === "GAME" && 
                <GameProvider>
                    <Game />
                </GameProvider>
            }
            {appState === "GAMEPLAY_TEST" && <GameplayTest />}
        </>
    );
};

export default App;
