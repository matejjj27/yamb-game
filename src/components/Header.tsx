import React, { useState } from "react";
import ConfirmResetModal from "./ConfirmResetModal";
import { useGameStore } from "../hooks/useGameStore";

const Header: React.FC = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const resetGame = useGameStore((state) => state.resetGame);
  const gameStarted = useGameStore((state) => state.gameStarted);
  const setGameStarted = useGameStore((state) => state.setGameStarted);

  const handleConfirm = () => {
    resetGame();
    setModalOpen(false);
    setGameStarted(false);
  };

  return (
    <header>
      <ConfirmResetModal
        isOpen={isModalOpen}
        onConfirm={handleConfirm}
        onCancel={() => setModalOpen(false)}
      />

      {gameStarted && (
        <button onClick={() => setModalOpen(true)} className="new-game-btn">
          New Game
        </button>
      )}

      <button
        className="toggle-darkmode"
        onClick={() => document.body.classList.toggle("dark")}
      >
        🌓
      </button>
    </header>
  );
};

export default Header;
