import React, { createContext, useContext, useState, ReactNode } from "react";

type AppState = "LOGIN" | "REGISTER" | "GAME" | "LOBBY";

type StateContextType = {
    appState: AppState;
    setAppState: (state: AppState) => void;
};

export const StateContext = createContext<StateContextType | null>(null);

export const StateProvider = ({ children }: { children: ReactNode }) => {
    const [appState, setAppState] = useState<AppState>("LOGIN");

    return (
        <StateContext.Provider value={{ appState, setAppState }}>
            {children}
        </StateContext.Provider>
    );
};

export const useAppState = () => {
    const context = useContext(StateContext);
    if (!context) throw new Error("useAppState must be used within a StateProvider");
    return context;
};
