import React, { useState } from "react";
import ConfirmResetModal from "./modals/ConfirmResetModal";
import { useGameStore } from "../hooks/useGameStore";
import { useTableStore } from "../hooks/useTableStore";
import { useDiceStore } from "../hooks/useDiceStore";

const Header: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { resetGame, gameStarted } = useGameStore();
  const { resetScore } = useTableStore();
  const { resetDice } = useDiceStore();

  const handleConfirm = () => {
    resetGame();
    resetDice();
    resetScore();
    setIsModalOpen(false);
  };

  return (
    <header>
      <ConfirmResetModal
        isOpen={isModalOpen}
        onConfirm={handleConfirm}
        onCancel={() => setIsModalOpen(false)}
      />

      {gameStarted && (
        <button className="new-game-btn" onClick={() => setIsModalOpen(true)}>
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
