import React, { useEffect } from "react";
import "./style.css";
import Login from "./authenticate/Login";
import Register from "./authenticate/Register";
import Menu from "./components/menu/Menu";
import GameWrapper from "./components/game/GameWrapper";

import { useAuth } from "./context/AuthContext";
import { useAppState } from "./context/StateContext";
import Lobby from "./components/game/Lobby";
import CreateLobby from "./components/preLobby/CreateLobby";
import Preload from "./components/load/Preload";
import { GameProvider } from "./context/GameContext";
import JoinGame from "./components/preLobby/JoinGame";
import GameCanvas from "./components/game/gameplay/GameCanvas";
import { GameplayTest } from "./components/game/gameplay/GameplayTest";

const App: React.FC = () => {

    const { isAuthenticated } = useAuth();
    const { appState, setAppState } = useAppState();

    return (
        <>
            {appState === "PRELOAD" && <Preload />}
            {appState === "LOGIN" && <Login />}
            {appState === "REGISTER" && <Register/ >}
            {appState === "MENU" && <Menu />}
            {appState === "CREATE" && <CreateLobby />}
            {appState === "JOIN" && <JoinGame />}
            {appState === "GAME" && <GameWrapper />}
            {appState === "GAMEPLAY_TEST" && <GameplayTest />}
        </>
    );
};

export default App;
