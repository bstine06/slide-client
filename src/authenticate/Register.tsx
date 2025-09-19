import React, { useState } from "react";
import '../styles/login.css';
import { registerUser } from "../api/AuthenticateAPI";
import { checkEmailAvailability, checkUsernameAvailability } from "../api/UserAPI";
import { useAuth } from "../context/AuthContext";
import { useAppState } from "../context/StateContext";
import { isLongEnough, isNonEmpty, isValidEmail, isValidPassword } from "../utils/validators";
import { AuthResponse } from "../types/AuthenticationTypes";

const Register = () => {

    const [email, setEmail] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [emailError, setEmailError] = useState<string>("");
    const [usernameError, setUsernameError] = useState<string>("");
    const [passwordError, setPasswordError] = useState<string>("");
    const [error, setError] = useState<string>("");
    const { setToken } = useAuth();
    const { setAppState } = useAppState();

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        if (!isValidEmail(email)) {
            setEmailError("Invalid email address");
            return;
        }
    
        if (!isValidPassword(password)) {
            setPassword("Password must be at least 8 characters long and contain a letter and a number");
            return;
        }

        try {
            const jwtToken = await registerUser({ email, username, password });
            setToken(jwtToken.token);
            setAppState("MENU")
        } catch (error) {
            setError('Failed to register.');
        }
    }

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        if (isValidEmail(e.target.value)) {
            setEmailError("");
        }
    }

    const handleEmailBlur = async () => {
        if (!isValidEmail(email)) {
            setEmailError("Invalid email address");
            return;
        } else {
            setEmailError("");
        }

        try {
            const isAvailable = await checkEmailAvailability(email);
            if (!isAvailable) {
                setEmailError("Email is already in use");
            } else {
                setEmailError("");
            }
        } catch (error) {
            console.error("Could not check email availability on email " + email);
        } 
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        if (isValidPassword(e.target.value)) {
            setPasswordError("");
        }
    }

    const handlePasswordBlur = () => {
        if (!isValidPassword(password)) {
            setPasswordError("Password must be at least 8 characters long and contain a letter and a number");
        } else {
            setPasswordError("");
        }
    };

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    }

    const handleUsernameBlur = async () => {
        console.log("USERNAME BLUR")
        if (!isLongEnough(username, 3)) {
            setUsernameError("Username must be at least 3 characters");
            return;
        }

        const isAvailable = await checkUsernameAvailability(username);
        if (!isAvailable) {
            setUsernameError("Username is already in use");
        } else {
            setUsernameError("");
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
                        id="email"
                        name="email"
                        className="username"
                        value={email}
                        onChange={(e) => handleEmailChange(e)}
                        onBlur={handleEmailBlur}
                    />
                    <p className="error-message">{emailError}</p>
                    
                    <label htmlFor="username">Username:</label>
                    <input
                        id="username"
                        name="username"
                        className="username"
                        value={username}
                        onChange={(e) => handleUsernameChange(e)}
                        onBlur={handleUsernameBlur}
                    />
                    <p className="error-message">{usernameError}</p>
                    
                    <label htmlFor="password">Password:</label>
                    <input
                        id="password"
                        type="password"
                        className="password"
                        value={password}
                        onChange={(e) => handlePasswordChange(e)}
                        onBlur={handlePasswordBlur}
                    />
                    <p className="error-message">{passwordError}</p>

                    {error && <p className="error-message">{error}</p>}
                    <button 
                        type="submit"
                        disabled = {!email || !username || !password || !!emailError || !!usernameError || !!passwordError}>
                            Submit
                    </button>
                </form>
                <a onClick={() => setAppState("LOGIN")} className="link">I already have an account</a>
            </div>
        </div>
        </>
    )
};

export default Register;
