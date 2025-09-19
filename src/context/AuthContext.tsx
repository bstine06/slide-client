import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
} from "react";

interface AuthContextType {
    token: string | null;
    username: string | null;
    setToken: (token: string | null) => void;
    isAuthenticated: boolean;
    logout: () => void;
    loading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

const TOKEN_KEY = "tokenWithExpiry";

interface StoredToken {
    token: string;
    expiry: number;
    username?: string;
}

function parseJwt(token: string): any | null {
    try {
        const [, payloadBase64] = token.split(".");
        const payload = JSON.parse(atob(payloadBase64));
        return payload;
    } catch {
        return null;
    }
}

function setTokenWithJwtExp(token: string): string | null {
    const payload = parseJwt(token);
    const expiry = payload?.exp ? payload.exp * 1000 : 0;
    const username = payload?.sub ?? null;

    const item: StoredToken = { token, expiry, username };
    localStorage.setItem(TOKEN_KEY, JSON.stringify(item));
    return username;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setTokenState] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const itemStr = localStorage.getItem(TOKEN_KEY);
        if (itemStr) {
            try {
                const { token, expiry, username }: StoredToken = JSON.parse(itemStr);
                if (token && (!expiry || Date.now() < expiry)) {
                    setTokenState(token);
                    setUsername(username || null);
                } else {
                    localStorage.removeItem(TOKEN_KEY);
                }
            } catch {
                localStorage.removeItem(TOKEN_KEY);
            }
        }
        setLoading(false); // done restoring
    }, []);

    useEffect(() => {
        if (token) {
            const exp = parseJwt(token)?.exp;
            if (exp && Date.now() > exp * 1000) {
                logout();
            }
        }
    }, [token]);

    const handleSetToken = (newToken: string | null) => {
        if (newToken) {
            const parsedUsername = setTokenWithJwtExp(newToken);
            setUsername(parsedUsername);
            setTokenState(newToken);
        } else {
            localStorage.removeItem(TOKEN_KEY);
            setTokenState(null);
            setUsername(null);
        }
    };

    const logout = () => {
        localStorage.removeItem(TOKEN_KEY);
        setTokenState(null);
        setUsername(null);
    };

    const isAuthenticated = !!token;

    return (
        <AuthContext.Provider
            value={{ token, username, setToken: handleSetToken, isAuthenticated, logout, loading }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};
