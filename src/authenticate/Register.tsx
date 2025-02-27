import React, { useState } from "react";
import '../styles/login.css';
import { registerUser } from "../api/AuthenticateAPI";

const Register = () => {

    const [email, setEmail] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        try {
            const result = await registerUser({ email, username, password });
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
                <h2>REGISTER</h2>
                <form onSubmit={onSubmit}>
                <label htmlFor="email">Email:</label>
                    <input
                        name="email"
                        className="username"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    
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

export default Register;
