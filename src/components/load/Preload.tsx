import React, { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getUserProfile } from "../../api/UserAPI";
import { useAppState } from "../../context/StateContext";
import { getGame } from "../../api/GameAPI";
import { GameDto } from "../../types/GameTypes";

const Preload: React.FC = () => {
  const { token, username, logout, loading } = useAuth();
  const { setAppState } = useAppState();

  useEffect(() => {
    // Wait until auth is restored
    if (loading) return;

    // If auth failed, bail early
    if (!token || !username) {
      logout();
      setAppState("LOGIN");
      return;
    }

    const run = async () => {
      try {
        // Verify user
        await getUserProfile(username, token);

        // See if they have a game
        try {
          const gameDto: GameDto = (await getGame(token)).content;
          if (gameDto) {
            setAppState("GAME");
            return;
          }
        } catch {
          console.info("No active game found");
        }

        setAppState("MENU");
      } catch (err) {
        console.error("Auth preload failed:", err);
        logout();
        setAppState("LOGIN");
      }
    };

    run();
  }, [loading, token, username, logout, setAppState]);

  // While restoring token from storage, block rendering
  return loading ? <h1>Loading...</h1> : null;
};

export default Preload;

