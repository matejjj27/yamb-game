import { ROWS, COLUMNS } from "../utils/constants";
import Buttons from "./Buttons";
import DiceRow from "./DiceRow";
import Legend from "./Legend";
import PlayerList from "./PlayerList";
import ScoreTable from "./ScoreTable";
import { useGameStore } from "../hooks/useGameStore";
import { useDiceStore } from "../hooks/useDiceStore";
import { useTableStore } from "../hooks/useTableStore";
import { isGameOver } from "../utils/functions";
import WinnerModal from "./modals/WinnerModal";
import { FC, useEffect, useState } from "react";

const Game: FC = () => {
  const {
    players,
    currentPlayerIndex,
    viewedPlayerIndex,
    setCurrentPlayerIndex,
    setViewedPlayerIndex,
  } = useGameStore();

  const { dice, rollCount, lastRollCount, resetDice } = useDiceStore();

  const {
    scoreTable,
    setPreviousCell,
    hasWrittenThisTurn,
    setHasWrittenThisTurn,
    isStarLockClicked,
    setIsStarLockClicked,
    lockedStarCell,
    setLockedStarCell,
    hasGameEnded,
    winnerInfo,
    calculateAndFill,
    handleGameEnd,
    recalculateTotalsForPlayer,
  } = useTableStore();

  const [isWinnerModalOpen, setIsWinnerModalOpen] = useState(false);

  useEffect(() => {
    setIsWinnerModalOpen(hasGameEnded && Boolean(winnerInfo));
  }, [winnerInfo, hasGameEnded]);

  const endTurn = () => {
    if (lockedStarCell && rollCount > 0 && !hasWrittenThisTurn) return;
    setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length);
    setViewedPlayerIndex((viewedPlayerIndex + 1) % players.length);
    resetDice();
    setHasWrittenThisTurn(false);
    setPreviousCell(null);
    setLockedStarCell(null);
    setIsStarLockClicked(false);
  };

  const handleCellClick = (row: number, col: number) => {
    setIsStarLockClicked(false);
    if (isGameOver(scoreTable)) {
      recalculateTotalsForPlayer(1);
      recalculateTotalsForPlayer(0);
      handleGameEnd();
    }
    if (
      currentPlayerIndex !== viewedPlayerIndex ||
      rollCount === 0 ||
      ROWS[row] === "" ||
      hasWrittenThisTurn ||
      (lockedStarCell &&
        (lockedStarCell?.rowId !== row || lockedStarCell?.colId !== col))
    )
      return;
    if (
      isStarLockClicked &&
      col === 3 &&
      !scoreTable[currentPlayerIndex][row][col]
    )
      setLockedStarCell({ rowId: row, colId: col });
    if (col === 3) {
      const canWrite =
        (lockedStarCell?.rowId === row && lockedStarCell?.colId === col) ||
        (lastRollCount === 5 && !lockedStarCell);

      if (!canWrite) return;
    } else if (!isCellEditable(row, col)) return;
    if (!isStarLockClicked) {
      setPreviousCell([row, col]);
      calculateAndFill(dice, currentPlayerIndex, row, col);
      setHasWrittenThisTurn(true);
    }
  };

  const isCellEditable = (row: number, col: number) => {
    const column = scoreTable[currentPlayerIndex].map((r) => r[col]);

    if (COLUMNS[col] === "⬇️") {
      const firstEmpty = column.findIndex(
        (val, id) => val === null && id !== 6 && id !== 9
      );
      return firstEmpty === row;
    } else if (COLUMNS[col] === "⬆️") {
      const reversed = [...column].reverse();
      const firstEmpty = reversed.findIndex(
        (val, id) => val === null && id !== 5 && id !== 8 && id !== 0
      );

      return ROWS.length - 1 - firstEmpty === row;
    } else if (COLUMNS[col] === "⬇️⬆️") {
      return scoreTable[currentPlayerIndex][row][col] === null;
    } else if (COLUMNS[col] === "⭐") {
      return !hasWrittenThisTurn;
    }
    return false;
  };

  return (
    <>
      <h1>🎲 Yamb Game</h1>
      <h2>
        {players[currentPlayerIndex].name}'s turn{" "}
        {lockedStarCell && `- Locked Cell: ${ROWS[lockedStarCell.rowId]}`}
      </h2>

      <PlayerList
        players={players}
        currentPlayerIndex={viewedPlayerIndex}
        setViewedPlayerIndex={setViewedPlayerIndex}
      />

      <DiceRow
        dice={dice}
        rollCount={rollCount}
        hasWrittenThisTurn={hasWrittenThisTurn}
      />

      <Buttons
        rollCount={rollCount}
        lastRollCount={lastRollCount}
        hasWrittenThisTurn={hasWrittenThisTurn}
        currentPlayerIndex={currentPlayerIndex}
        viewedPlayerIndex={viewedPlayerIndex}
        lockedStarCell={lockedStarCell}
        isStarLockClicked={isStarLockClicked}
        setIsStarLockClicked={setIsStarLockClicked}
        endTurn={endTurn}
        lockInCell={setLockedStarCell}
      />

      <ScoreTable
        scoreTable={scoreTable}
        viewedPlayerIndex={viewedPlayerIndex}
        lockedStarCell={lockedStarCell}
        handleCellClick={handleCellClick}
      />

      <Legend />

      <WinnerModal
        isOpen={isWinnerModalOpen}
        setIsWinnerModalOpen={setIsWinnerModalOpen}
      />
    </>
  );
};

export default Game;
