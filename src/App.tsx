import "./styles/App.css";
import LandingPage from "./components/LandingPage";
import Game from "./components/Game";
import { useGameStore } from "./hooks/useGameStore";
import ConfirmResetModal from "./components/ConfirmResetModal";
import { useState } from "react";

export default function App() {
  const [isModalOpen, setModalOpen] = useState(false);
  const newPlayers = useGameStore((state) => state.players);
  const setNewPlayers = useGameStore((state) => state.setPlayers);
  const gameStarted = useGameStore((state) => state.gameStarted);
  const setGameStarted = useGameStore((state) => state.setGameStarted);
  const resetGame = useGameStore((state) => state.resetGame);

  const startGame = (names: string[]) => {
    const players = names.map((name) => ({
      id: crypto.randomUUID(),
      name,
    }));
    setNewPlayers(players);
    setGameStarted(true);
  };

  const handleConfirm = () => {
    resetGame();
    setModalOpen(false);
    setGameStarted(false);
  };

  return (
    <div className="app-container">
      <ConfirmResetModal
        isOpen={isModalOpen}
        onConfirm={handleConfirm}
        onCancel={() => setModalOpen(false)}
      />

      <button onClick={() => setModalOpen(true)} className="new-game-btn">
        New Game
      </button>

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
