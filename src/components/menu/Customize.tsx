import React, {useEffect, useState} from "react";
import { useAuth } from "../../context/AuthContext";
import { getUserProfile, updateUserColor } from "../../api/UserAPI";
import "../../styles/menu.css";
import { useAppState } from "../../context/StateContext";

const Customize : React.FC = () => {

    const [r, setR] = useState<number>(255);
    const [g, setG] = useState<number>(0);
    const [b, setB] = useState<number>(0);

    const { username, token } = useAuth();
    const { setAppState } = useAppState();

    useEffect(() => {
            (async () => {
                try {
                    if (token && username) {
                        const profile = await getUserProfile(username, token);
                        console.log(profile.color);
                        setRGB(profile.color);
                    }
                } catch (error) {
                    console.error("Failed to fetch user profile:", error);
                }
            })();
    }, [token]);

    const setRGB = (hex: string) => {
        setR(parseInt(hex.substring(1, 3), 16));
        setG(parseInt(hex.substring(3, 5), 16));
        setB(parseInt(hex.substring(5, 7), 16));
        console.log(r, g, b);
    }

    const toHex = (c: number) => {
        return c.toString(16).padStart(2, "0").toUpperCase(); // base-16 + pad
    }

    const handleSaveChanges = async () => {
        
        if (username && token) {
            const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
            await updateUserColor(username, hex, token);
            setAppState("MENU");
        }

    }

    const handleDiscardChanges = () => {
        setAppState("MENU");
    }

   

    return (
        <>
            <h1>Customize</h1>
            <h2>{username}</h2>
            <div
                style={{
                    width: "200px",
                    height: "200px",
                    backgroundColor: `rgb(${r},${g},${b})`,
                    margin: "auto"
                }}
            ></div>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column"
                }}
            >
                <label htmlFor="red">Red</label>
                <input
                    onChange={(e) => setR(Number(e.target.value))}
                    name="red"
                    id="red-slider"
                    type="range"
                    value={r ?? 255}
                    min={0}
                    max={255}
                ></input>
                <label htmlFor="green">Green</label>
                <input
                    onChange={(e) => setG(Number(e.target.value))}
                    name="green"
                    id="green-slider"
                    type="range"
                    value={g ?? 0}
                    min={0}
                    max={255}
                ></input>
                <label htmlFor="blue">Blue</label>
                <input
                    onChange={(e) => setB(Number(e.target.value))}
                    name="blue"
                    id="blue-slider"
                    type="range"
                    value={b ?? 0}
                    min={0}
                    max={255}
                ></input>
                <div className="buttons">
                    <button onClick={handleSaveChanges}>SAVE CHANGES</button>
                    <button onClick={handleDiscardChanges}>DISCARD CHANGES</button>
                </div>
            </div>
        </>
    );

}

export default Customize;