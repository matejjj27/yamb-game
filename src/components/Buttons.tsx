import React from "react";
import { ButtonsProps } from "../utils/types";
import { MAX_ROLLS } from "../utils/constants";
import { useDiceStore } from "../hooks/useDiceStore";
import { useTableStore } from "../hooks/useTableStore";

const Buttons: React.FC<ButtonsProps> = ({
  rollCount,
  lastRollCount,
  hasWrittenThisTurn,
  currentPlayerIndex,
  viewedPlayerIndex,
  lockedStarCell,
  isStarLockClicked,
  setIsStarLockClicked,
  endTurn,
  lockInCell,
}) => {
  const { rollDice } = useDiceStore();
  const { previousCell, undoWriting } = useTableStore();
  const hasTurn = currentPlayerIndex === viewedPlayerIndex;
  const isLockButtonDisabled =
    !hasTurn ||
    (isStarLockClicked && !lockedStarCell) ||
    rollCount === 0 ||
    rollCount === 3 ||
    lastRollCount !== 5;

  const isRollButtonDisabled =
    rollCount >= MAX_ROLLS ||
    hasWrittenThisTurn ||
    !hasTurn ||
    isStarLockClicked;

  return (
    <div className="buttons">
      <button
        className="primary"
        onClick={rollDice}
        disabled={isRollButtonDisabled}
      >
        Roll ({rollCount}/{MAX_ROLLS})
      </button>
      <button
        className="primary"
        onClick={endTurn}
        disabled={!hasWrittenThisTurn || !hasTurn}
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
