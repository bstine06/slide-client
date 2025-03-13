import React, { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
    token: string | null;
    setToken: (token: string | null) => void;
    isAuthenticated: boolean;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children : ReactNode }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

    const handleSetToken = (newToken: string | null) => {
        if (newToken) {
            localStorage.setItem("token", newToken);
        } else {
            localStorage.removeItem("token");
        }
        setToken(newToken);
    };

    const isAuthenticated = !!token;

    const logout = () => setToken(null);

    return (
        <AuthContext.Provider value={{ token, setToken: handleSetToken, isAuthenticated, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};