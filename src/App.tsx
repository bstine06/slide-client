import React, { useEffect } from "react";
import "./style.css";
import Login from "./authenticate/Login";
import Register from "./authenticate/Register";
import Menu from "./components/menu/Menu";
import GameWrapper from "./components/game/GameWrapper";

import { useAuth } from "./context/AuthContext";
import { useAppState } from "./context/StateContext";
import CreateLobby from "./components/preLobby/CreateLobby";
import Preload from "./components/load/Preload";
import JoinGame from "./components/preLobby/JoinGame";
import { GameplayTest } from "./components/game/gameplay/GameplayTest";
import Customize from "./components/menu/Customize";


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
            {appState === "GAME" && <GameWrapper />}
            {appState === "GAMEPLAY_TEST" && <GameplayTest />}
        </>
    );
};

export default App;
