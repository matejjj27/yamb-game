import React from "react";
import { ButtonsProps } from "../utils/types";
import { MAX_ROLLS } from "../utils/constants";

const Buttons: React.FC<ButtonsProps> = ({
  rolls,
  hasWrittenThisTurn,
  previousCell,
  currentPlayerIndex,
  viewedPlayerIndex,
  lockedStarCell,
  isStarLockClicked,
  setIsStarLockClicked,
  rollDice,
  endTurn,
  undoWriting,
  lockInCell,
}) => {
  const hasTurn = currentPlayerIndex === viewedPlayerIndex;
  const isLockButtonDisabled =
    !hasTurn ||
    (isStarLockClicked && !lockedStarCell) ||
    rolls === 0 ||
    rolls === 3;
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
        disabled={isLockButtonDisabled}
        className="primary"
        onClick={() => {
          if (lockedStarCell) {
            setIsStarLockClicked(false);
            lockInCell(null);
          } else setIsStarLockClicked(true);
        }}
      >
        {!isStarLockClicked && !lockedStarCell
          ? "⭐ Lock"
          : isStarLockClicked && !lockedStarCell
            ? "Select"
            : "Undo Lock"}
      </button>
    </div>
  );
};

export default Buttons;
