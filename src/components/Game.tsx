import { useState } from "react";
import { useDice } from "../hooks/useDice";
import { useScoreTable } from "../hooks/useScoreTable";
import { ROWS, COLUMNS } from "../utils/constants";
import Buttons from "./Buttons";
import DiceRow from "./DiceRow";
import Legend from "./Legend";
import PlayerList from "./PlayerList";
import ScoreTable from "./ScoreTable";
import { GameProps, Player } from "../utils/types";

const Game: React.FC<GameProps> = ({ newPlayers }) => {
  const [players] = useState<Player[]>(newPlayers);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState<number>(0);
  const [viewedPlayerIndex, setViewedPlayerIndex] = useState<number>(0);

  const {
    dice,
    setDice,
    rolls,
    lastRollCount,
    isRolling,
    setLastRollCount,
    rollDice,
    resetDice,
  } = useDice();
  const {
    scoreTable,
    totals,
    previousCell,
    setPreviousCell,
    hasWrittenThisTurn,
    setHasWrittenThisTurn,
    isStarLockClicked,
    setIsStarLockClicked,
    lockedStarCell,
    setLockedStarCell,
    calculateAndFill,
    undoWriting,
  } = useScoreTable(players);

  const endTurn = () => {
    if (lockedStarCell && rolls > 0 && !hasWrittenThisTurn) return;
    setCurrentPlayerIndex((prev) => (prev + 1) % players.length);
    setViewedPlayerIndex((prev) => (prev + 1) % players.length);
    resetDice();
    setHasWrittenThisTurn(false);
    setPreviousCell(null);
    setLockedStarCell(null);
    setIsStarLockClicked(false);
    setLastRollCount(5);
  };

  const handleCellClick = (row: number, col: number) => {
    setIsStarLockClicked(false);
    if (rolls === 0) return;
    if (ROWS[row] === "") return;
    if (hasWrittenThisTurn) return;
    if (
      lockedStarCell &&
      (lockedStarCell?.rowId !== row || lockedStarCell?.colId !== col)
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
        rolls={rolls}
        hasWrittenThisTurn={hasWrittenThisTurn}
        isRolling={isRolling}
        setDice={setDice}
      />

      <Buttons
        rolls={rolls}
        lastRollCount={lastRollCount}
        hasWrittenThisTurn={hasWrittenThisTurn}
        previousCell={previousCell}
        currentPlayerIndex={currentPlayerIndex}
        viewedPlayerIndex={viewedPlayerIndex}
        lockedStarCell={lockedStarCell}
        isStarLockClicked={isStarLockClicked}
        setIsStarLockClicked={setIsStarLockClicked}
        rollDice={rollDice}
        endTurn={endTurn}
        undoWriting={undoWriting}
        lockInCell={setLockedStarCell}
      />

      <ScoreTable
        totals={totals}
        scoreTable={scoreTable}
        viewedPlayerIndex={viewedPlayerIndex}
        lockedStarCell={lockedStarCell}
        handleCellClick={handleCellClick}
      />

      <Legend />
    </>
  );
};

export default Game;
