import { useState } from "react";
import "./styles/App.css";
import { ROWS, COLUMNS, samplePlayers } from "./utils/constants";
import PlayerList from "./components/PlayerList";
import DiceRow from "./components/DiceRow";
import Buttons from "./components/Buttons";
import Legend from "./components/Legend";
import ScoreTable from "./components/ScoreTable";
import { useDice } from "./hooks/useDice";
import { useScoreTable } from "./hooks/useScoreTable";

export default function App() {
  const [players] = useState(samplePlayers);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [viewedPlayerIndex, setViewedPlayerIndex] = useState(0);

  const { dice, setDice, rolls, lastRollCount, rollDice, resetDice } =
    useDice();
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
        (val, id) => val === null && id !== 4 && id !== 7 && id !== 0
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
    <div className="app-container">
      <button
        className="toggle-darkmode"
        onClick={() => document.body.classList.toggle("dark")}
      >
        🌓
      </button>
      <h1>🎲 Yamb</h1>

      <PlayerList
        players={players}
        currentPlayerIndex={viewedPlayerIndex}
        setViewedPlayerIndex={setViewedPlayerIndex}
      />

      <DiceRow
        dice={dice}
        rolls={rolls}
        hasWrittenThisTurn={hasWrittenThisTurn}
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
    </div>
  );
}
