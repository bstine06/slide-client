import React, { useState } from "react";
import "../../styles/login.css";
import { registerUser } from "../../api/AuthenticateAPI";
import {
    checkEmailAvailability,
    checkUsernameAvailability,
} from "../../api/UserAPI";
import { useAuth } from "../../context/AuthContext";
import { useAppState } from "../../context/StateContext";
import {
    isLongEnough,
    isNonEmpty,
    isValidEmail,
    isValidPassword,
} from "../../utils/validators";
import { AuthResponse } from "../../types/AuthenticationTypes";
import { HttpError } from "../../types/ErrorTypes";

const Register: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [emailError, setEmailError] = useState<string>("");
    const [usernameError, setUsernameError] = useState<string>("");
    const [passwordError, setPasswordError] = useState<string>("");
    const [errorMsg, setErrorMsg] = useState<string>("");
    const [errorDetails, setErrorDetails] = useState<string>("");
    const [errorAdvice, setErrorAdvice] = useState<string>("");
    const { setToken } = useAuth();
    const { setAppState } = useAppState();

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!isValidEmail(email)) {
            setEmailError("Invalid email address");
            return;
        }

        if (!isValidPassword(password)) {
            setPassword(
                "Password must be at least 8 characters long and contain a letter and a number"
            );
            return;
        }

        try {
            const jwtToken = await registerUser({ email, username, password });
            setToken(jwtToken.token);
            setAppState("MENU");
        } catch (error) {
            setErrorMsg("Could not register:");

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
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        if (isValidEmail(e.target.value)) {
            setEmailError("");
        }
    };

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
            setErrorMsg("Could not check email availability:");

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
    };

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    };

    const handleUsernameBlur = async () => {
        console.log("USERNAME BLUR");
        if (!isLongEnough(username, 3)) {
            setUsernameError("Username must be at least 3 characters");
            return;
        }

        try {
            const isAvailable = await checkUsernameAvailability(username);
            if (!isAvailable) {
                setUsernameError("Username is already in use");
            } else {
                setUsernameError("");
            }
        } catch (error) {
            setErrorMsg("Could not check username availability:");

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
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        if (isValidPassword(e.target.value)) {
            setPasswordError("");
        }
    };

    const handlePasswordBlur = () => {
        if (!isValidPassword(password)) {
            setPasswordError(
                "Password must be at least 8 characters long and contain a letter and a number"
            );
        } else {
            setPasswordError("");
        }
    };

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
                        {emailError && <p className="error-message">{emailError}</p>}

                        <label htmlFor="username">Username:</label>
                        <input
                            id="username"
                            name="username"
                            className="username"
                            value={username}
                            onChange={(e) => handleUsernameChange(e)}
                            onBlur={handleUsernameBlur}
                        />
                        {usernameError && <p className="error-message">{usernameError}</p>}

                        <label htmlFor="password">Password:</label>
                        <input
                            id="password"
                            type="password"
                            className="password"
                            value={password}
                            onChange={(e) => handlePasswordChange(e)}
                            onBlur={handlePasswordBlur}
                        />
                        {passwordError && <p className="error-message">{passwordError}</p>}

                        {errorMsg && <p className="error-message">{errorMsg}</p>}
                        {errorDetails && <p className="error-message">{errorDetails}</p>}
                        {errorAdvice && <p className="error-message">{errorAdvice}</p>}
                        <button
                            type="submit"
                            disabled={
                                !email ||
                                !username ||
                                !password ||
                                !!emailError ||
                                !!usernameError ||
                                !!passwordError
                            }
                        >
                            Submit
                        </button>
                    </form>
                    <a onClick={() => setAppState("LOGIN")} className="link">
                        I already have an account
                    </a>
                </div>
            </div>
        </>
    );
};

export default Register;
