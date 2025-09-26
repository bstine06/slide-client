import React, { createContext, useContext, useState, ReactNode } from "react";

type AppState = "PRELOAD" | "LOGIN" | "REGISTER" | "MENU" | "CUSTOMIZE" | "GAME" | "CREATE" | "JOIN" | "POSTGAME"
    //TODO remove this once canvas is actually implemented
    | "GAMEPLAY_TEST";

type StateContextType = {
    appState: AppState;
    setAppState: (state: AppState) => void;
    currentGameId: string | undefined;
    setCurrentGameId: (gameId: string | undefined) => void;
};

export const StateContext = createContext<StateContextType | null>(null);

export const StateProvider = ({ children }: { children: ReactNode }) => {
    const [appState, setAppState] = useState<AppState>("PRELOAD");
    const [currentGameId, setCurrentGameId] = useState<string | undefined>(undefined);

    return (
        <StateContext.Provider value={{ appState, setAppState, currentGameId, setCurrentGameId }}>
            {children}
        </StateContext.Provider>
    );
};

export const useAppState = () => {
    const context = useContext(StateContext);
    if (!context) throw new Error("useAppState must be used within a StateProvider");
    return context;
};
