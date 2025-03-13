import React, { useState } from "react";
import "./style.css";
import Login from "./authenticate/Login";
import Register from "./authenticate/Register";
import Menu from "./components/menu/Menu";
import Game from "./components/game/Game";

import { useAuth } from "./context/AuthContext";
import { useAppState } from "./context/StateContext";

const App: React.FC = () => {

    const { isAuthenticated } = useAuth();
    const { appState } = useAppState();

    if (!isAuthenticated) {
        return appState === "REGISTER" ? <Register /> : <Login />;
    }

    return (
        <>
            {appState === "REGISTER" && <Register />}
            {appState === "LOGIN" && <Login />}
            {appState === "LOBBY" && <Menu />}
            {appState === "GAME" && <Game />}
        </>
    );
};

export default App;
