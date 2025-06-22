import React from "react";
import { useTableStore } from "../../hooks/useTableStore";
import { useGameStore } from "../../hooks/useGameStore";
import { WinnerModalProps } from "../../utils/types";
import { useDiceStore } from "../../hooks/useDiceStore";

const WinnerModal: React.FC<WinnerModalProps> = ({
  isOpen,
  setIsWinnerModalOpen,
}) => {
  if (!isOpen) return null;

  const { resetGame, players } = useGameStore();
  const { resetDice } = useDiceStore();
  const { winnerInfo, resetScore, totals } = useTableStore();

  const handlePlayAgain = () => {
    resetGame();
    resetScore();
    resetDice();
    setIsWinnerModalOpen(false);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>🎉 Yamb!</h2>

        {winnerInfo && (
          <>
            <p className="winner-announcement">
              🏆{" "}
              <strong>
                {players?.[winnerInfo.idx]?.name ||
                  `Player ${winnerInfo.idx + 1}`}
              </strong>{" "}
              wins with <strong>{winnerInfo.score}</strong> points!
            </p>

            <h3 style={{ marginTop: "1rem" }}>📊 Standings:</h3>
            {totals.map((total, idx) => {
              const playerName = players?.[idx]?.name || `Player ${idx + 1}`;
              return (
                <p key={idx}>
                  👤 <strong>{playerName}</strong>: {total?.grandTotal ?? 0}{" "}
                  points
                </p>
              );
            })}
          </>
        )}

        <div
          className="buttons"
          style={{ marginTop: "1.5rem", marginBottom: "0.5rem" }}
        >
          <button onClick={handlePlayAgain} className="btn confirm">
            🔄 Play Again
          </button>
          <button
            onClick={() => setIsWinnerModalOpen(false)}
            className="btn cancel"
          >
            ❌ Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default WinnerModal;
