import React, { useState } from "react";
import '../../styles/login.css';
import { authenticateUser } from "../../api/AuthenticateAPI";
import { useAuth } from "../../context/AuthContext";
import { useAppState } from "../../context/StateContext";
import { HttpError } from "../../types/ErrorTypes";

const Login = () => {

    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [errorMsg, setErrorMsg] = useState<string>("");
    const [errorDetails, setErrorDetails] = useState<string>("");
    const [errorAdvice, setErrorAdvice] = useState<string>("");
    const { setToken } = useAuth();
    const { setAppState } = useAppState();

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        try {
            const jwtToken = await authenticateUser({ username, password });
            setToken(jwtToken.token);
            setAppState("MENU");
        } catch (error : any) {
                    setErrorMsg("Could not log in:");
        
                    if (error instanceof HttpError) {
                        setErrorDetails(error.message || JSON.stringify(error));
                        error.advice && setErrorAdvice(error.advice);
                    } else if (error instanceof Error) {
                        // Regular JS/TS error
                        setErrorDetails(error.message);
                    } else {
                        // String, number, etc.
                        setErrorDetails(String(error));
                    }
                }
    }

    return (
        <>
        <div className="fullscreen-container">
            <div className="login-container">
                <h1>SLIDE</h1>
                <p>ALPHA 0.0.1</p>
                <h2>LOGIN</h2>
                <form onSubmit={onSubmit}>
                    
                    <label htmlFor="username">Email or username:</label>
                    <input
                        id="username"
                        name="username"
                        className="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    
                    <label htmlFor="password">Password:</label>
                    <input
                        id="password"
                        type="password"
                        className="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit">Submit</button>
                    {errorMsg && <p className="error-message">{errorMsg}</p>}
                    {errorDetails && <p className="error-message">{errorDetails}</p>}
                    {errorAdvice && <p className="error-message">{errorAdvice}</p>}
                </form>
                <a onClick={() => setAppState("REGISTER")} className="link">I don't have an account</a>
            </div>
        </div>
        </>
    )
};

export default Login;
