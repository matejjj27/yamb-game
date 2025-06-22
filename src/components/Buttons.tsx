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
  const { rollDice, isRolling } = useDiceStore();
  const { hasGameEnded, previousCell, undoWriting } = useTableStore();
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
    isStarLockClicked ||
    hasGameEnded ||
    isRolling;

  return (
    <div className="buttons">
      <button
        className="primary roll-button"
        onClick={rollDice}
        disabled={isRollButtonDisabled}
      >
        {isRolling ? (
          <span className="spinner" />
        ) : (
          <>
            Roll ({rollCount}/{MAX_ROLLS})
          </>
        )}
      </button>
      <button
        className="primary"
        onClick={endTurn}
        disabled={!hasWrittenThisTurn || !hasTurn || hasGameEnded}
      >
        End Turn
      </button>
      <button
        className="primary"
        onClick={() => undoWriting(currentPlayerIndex)}
        disabled={!previousCell || !hasTurn || hasGameEnded}
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
