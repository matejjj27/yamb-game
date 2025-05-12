import React from "react";
import { ButtonsProps } from "../utils/types";
import { MAX_ROLLS } from "../utils/constants";

const Buttons: React.FC<ButtonsProps> = ({
  rolls,
  hasWrittenThisTurn,
  previousCell,
  currentPlayerIndex,
  viewedPlayerIndex,
  rollDice,
  endTurn,
  undoWriting,
  lockInCell,
}) => {
  const hasTurn = currentPlayerIndex === viewedPlayerIndex;
  return (
    <div className="buttons">
      <button
        className="primary"
        onClick={rollDice}
        disabled={rolls >= MAX_ROLLS || hasWrittenThisTurn || !hasTurn}
      >
        Roll ({rolls}/{MAX_ROLLS})
      </button>
      <button
        className="primary"
        onClick={endTurn}
        disabled={!hasWrittenThisTurn}
      >
        End Turn
      </button>
      <button
        className="primary"
        onClick={() => undoWriting(currentPlayerIndex)}
        disabled={!previousCell || !hasTurn}
      >
        Undo
      </button>
      <button
        disabled={!hasTurn}
        className="primary"
        onClick={() => {
          const cell = prompt("Lock in row number (1–14) for ⭐ column:");
          if (cell && !hasWrittenThisTurn) {
            lockInCell({ rowId: +cell - 1, colId: 3 });
          }
        }}
      >
        ⭐ Lock
      </button>
    </div>
  );
};

export default Buttons;
