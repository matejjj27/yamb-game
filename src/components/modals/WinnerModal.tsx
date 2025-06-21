import React from "react";
import { useTableStore } from "../../hooks/useTableStore";
import { useGameStore } from "../../hooks/useGameStore";
import { WinnerModalProps } from "../../utils/types";

const WinnerModal: React.FC<WinnerModalProps> = ({ isOpen }) => {
  if (!isOpen) return null;

  const { resetGame, players } = useGameStore();
  const { winnerInfo, resetScore } = useTableStore();

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>🎉 Game Over!</h2>
        {winnerInfo && (
          <p>
            🏆{" "}
            {players?.find((_, id) => id === winnerInfo.idx)?.name || "Player"}{" "}
            wins with {winnerInfo.score} points!
          </p>
        )}
        <button
          onClick={() => {
            resetGame();
            resetScore();
          }}
          className="btn confirm"
        >
          Play Again
        </button>
      </div>
    </div>
  );
};

export default WinnerModal;
