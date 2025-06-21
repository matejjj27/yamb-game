import React, { useState } from "react";
import ConfirmResetModal from "./modals/ConfirmResetModal";
import { useGameStore } from "../hooks/useGameStore";

const Header: React.FC = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const { resetGame, gameStarted, setGameStarted } = useGameStore();

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
        <button className="new-game-btn" onClick={() => setModalOpen(true)}>
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
