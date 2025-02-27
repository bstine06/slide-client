import React from "react";
import '../styles/login.css';

const Login = () => {

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
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
                    <input name="username" className="username"></input>
                    <label htmlFor="password">Password:</label>
                    <input className="password"></input>
                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
        </>
    )
};

export default Login;
