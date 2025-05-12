import React from "react";
import { ButtonsProps } from "../utils/types";
import { MAX_ROLLS } from "../utils/constants";

const Buttons: React.FC<ButtonsProps> = ({
  rolls,
  hasWrittenThisTurn,
  lockedStarCell,
  previousCell,
  currentPlayerIndex,
  rollDice,
  endTurn,
  undoWriting,
  lockInCell,
}) => {
  return (
    <div className="buttons">
      <button
        className="primary"
        onClick={rollDice}
        disabled={rolls >= MAX_ROLLS || hasWrittenThisTurn}
      >
        Roll ({rolls}/{MAX_ROLLS})
      </button>
      <button
        className="primary"
        onClick={endTurn}
        disabled={!hasWrittenThisTurn && !lockedStarCell}
      >
        End Turn
      </button>
      <button
        className="primary"
        onClick={() => undoWriting(currentPlayerIndex)}
        disabled={!previousCell}
      >
        Undo
      </button>
      <button
        className="primary"
        onClick={() => {
          const cell = prompt("Lock in row number (1–14) for ⭐ column:");
          if (cell && !hasWrittenThisTurn) {
            lockInCell([+cell - 1, 3]);
          }
        }}
      >
        ⭐ Lock
      </button>
    </div>
  );
};

export default Buttons;
