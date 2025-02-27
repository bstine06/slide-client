import React, { useState } from "react";
import "./style.css";
import Login from "./authenticate/Login";
import Register from "./authenticate/Register";
import Menu from "./components/menu/Menu";
import Game from "./components/game/Game";

type AppState = "REGISTER" | "LOGIN" | "MENU" | "GAME";

const App: React.FC = () => {
    const [appState, setAppState] = useState<AppState>("REGISTER");

    return (
        <>
            {appState === "REGISTER" && <Register />}
            {appState === "LOGIN" && <Login />}
            {appState === "MENU" && <Menu />}
            {appState === "GAME" && <Game />}
        </>
    );
};

export default App;
