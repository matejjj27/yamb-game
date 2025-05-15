import { useState } from "react";
import "./styles/App.css";
import LandingPage from "./components/LandingPage";
import Game from "./components/Game";
import { Player } from "./utils/types";

export default function App() {
  const [newPlayers, setNewPlayers] = useState<Player[]>([]);
  const [gameStarted, setGameStarted] = useState<boolean>(false);

  const startGame = (names: string[]) => {
    const players = names.map((name) => ({
      id: crypto.randomUUID(),
      name,
    }));
    setNewPlayers(players);
    setGameStarted(true);
  };

  return (
    <div className="app-container">
      <button
        className="toggle-darkmode"
        onClick={() => document.body.classList.toggle("dark")}
      >
        🌓
      </button>
      {gameStarted ? (
        <Game newPlayers={newPlayers} />
      ) : (
        <LandingPage onStartGame={startGame} />
      )}
    </div>
  );
}
