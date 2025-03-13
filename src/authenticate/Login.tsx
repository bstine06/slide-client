import React, { useState } from "react";
import '../styles/login.css';
import { authenticateUser } from "../api/AuthenticateAPI";
import { useAuth } from "../context/AuthContext";

const Login = () => {

    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const { setToken } = useAuth();

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        try {
            const jwtToken = await authenticateUser({ username, password });
            setToken(jwtToken);
        } catch (error) {
            setError('Failed to register.');
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
                    
                    <label htmlFor="username">Username:</label>
                    <input
                        name="username"
                        className="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        className="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
        </>
    )
};

export default Login;
