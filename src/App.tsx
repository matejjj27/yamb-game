import { useState } from "react";
import "./styles/App.css";
import { v4 as uuidv4 } from "uuid";
import { ROWS, COLUMNS, MAX_ROLLS } from "./utils/constants";
import { generateDice } from "./utils/functions";
import { Dice, PlayerTotals, Section } from "./utils/types";
import PlayerList from "./components/PlayerList";
import DiceRow from "./components/DiceRow";
import Buttons from "./components/Buttons";
import Legend from "./components/Legend";
import ScoreTable from "./components/ScoreTable";

export default function App() {
  const [players] = useState([
    { id: uuidv4(), name: "Player 1" },
    { id: uuidv4(), name: "Player 2" },
  ]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [dice, setDice] = useState<Dice[]>(generateDice());
  const [rolls, setRolls] = useState(0);
  const [hasWrittenThisTurn, setHasWrittenThisTurn] = useState(false);
  const [scoreTable, setScoreTable] = useState(
    players.map(() => ROWS.map(() => Array(COLUMNS.length).fill(null)))
  );
  const [previousCell, setPreviousCell] = useState<number[] | null>(null);
  const [lockedStarCell, setLockedStarCell] = useState<number[] | null>(null);
  const [totals, setTotals] = useState<PlayerTotals[]>(
    players.map(() => ({
      top: Array(COLUMNS.length).fill(0),
      mid: Array(COLUMNS.length).fill(0),
      bottom: Array(COLUMNS.length).fill(0),
    }))
  );

  const rollDice = () => {
    if (rolls >= MAX_ROLLS) return;
    if (rolls === 0) {
      setDice(generateDice());
    } else {
      setDice((prev) =>
        prev.map((d) =>
          d.locked ? d : { ...d, value: Math.ceil(Math.random() * 6) }
        )
      );
    }
    setRolls((r) => r + 1);
  };

  const endTurn = () => {
    if (lockedStarCell && rolls > 0 && !hasWrittenThisTurn) return;
    setCurrentPlayerIndex((prev) => (prev + 1) % players.length);
    setDice(generateDice());
    setRolls(0);
    setHasWrittenThisTurn(false);
    setPreviousCell(null);
    setLockedStarCell(null);
  };

  const handleCellClick = (row: number, col: number) => {
    if (rolls === 0) return;
    if (ROWS[row] === "") return;
    if (hasWrittenThisTurn) return;

    const rolledAllDice = dice.every((d) => !d.locked);

    if (col === 3) {
      const canWrite =
        (lockedStarCell?.[0] === row && lockedStarCell?.[1] === col) ||
        (rolls > 0 && rolledAllDice && !lockedStarCell);

      if (!canWrite) return;
    } else if (!isCellEditable(row, col)) {
      return;
    }

    setPreviousCell([row, col]);
    calculateAndFill(row, col);
    setHasWrittenThisTurn(true);
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

  const calculateAndFill = (row: number, col: number) => {
    const values = dice.map((d) => d.value);
    let score = 0;
    if (row < 6) {
      const target = row + 1;
      score = values.filter((v) => v === target).reduce((a, b) => a + b, 0);
    } else if (row === 7 || row === 8) {
      score = values.reduce((a, b) => a + b, 0);
    } else if (row === 10) {
      const sorted = [...values].sort().join("");
      score = sorted === "12345" ? 40 : sorted === "23456" ? 45 : 0;
    } else if (row === 11) {
      const counts = values.reduce(
        (acc: Record<number, number>, val: number) => (
          (acc[val] = (acc[val] || 0) + 1), acc
        ),
        {}
      );
      const has3 = Object.values(counts).includes(3);
      const has2 = Object.values(counts).includes(2);
      score = has3 && has2 ? values.reduce((a, b) => a + b, 0) + 30 : 0;
    } else if (row === 12) {
      const counts = values.reduce(
        (acc: Record<number, number>, val: number) => (
          (acc[val] = (acc[val] || 0) + 1), acc
        ),
        {}
      );
      const four = Object.entries(counts).find(([_, count]) => count >= 4);
      score = four ? Number(four[0]) * 4 + 40 : 0;
    } else if (row === 13) {
      const first = values[0];
      if (values.every((v) => v === first)) {
        score = first * 5 + 50;
      }
    }

    const newTable = [...scoreTable];
    newTable[currentPlayerIndex][row][col] = score;
    setScoreTable(newTable);
    if (row >= 0 && row <= 5) {
      calculateSectionColumnTotal(currentPlayerIndex, col, row, "top");
    } else if (row >= 7 && row <= 8) {
      calculateSectionColumnTotal(currentPlayerIndex, col, row, "mid");
    } else if (row >= 10 && row <= 14) {
      calculateSectionColumnTotal(currentPlayerIndex, col, row, "bottom");
    }
  };

  const undoWriting = () => {
    if (!previousCell) return;
    const [row, col] = previousCell;
    const newTable = [...scoreTable];
    newTable[currentPlayerIndex][row][col] = null;
    setScoreTable(newTable);
    recalculateTotalsForPlayer(currentPlayerIndex);
    setHasWrittenThisTurn(false);
    setPreviousCell(null);
  };

  const recalculateTotalsForPlayer = (playerIndex: number) => {
    const playerTable = scoreTable[playerIndex];
    const newTotals = {
      top: [0, 0, 0, 0],
      mid: [0, 0, 0, 0],
      bottom: [0, 0, 0, 0],
    };

    for (let col = 0; col < 4; col++) {
      let top = 0,
        bottom = 0;
      let max: number | null = null;
      let min: number | null = null;
      let firstRowVal: number | null = null;

      for (let row = 0; row < playerTable.length; row++) {
        const val = playerTable[row][col];
        if (val === null) continue;

        if (row >= 0 && row <= 5) top += val;

        if (row === 0) firstRowVal = val;
        if (row === 7) max = val;
        if (row === 8) min = val;

        if (row >= 10 && row <= 14) bottom += val;
      }

      newTotals.top[col] = top;

      if (max !== null && min !== null && firstRowVal !== null) {
        newTotals.mid[col] = (max - min) * firstRowVal;
      } else {
        newTotals.mid[col] = 0;
      }

      newTotals.bottom[col] = bottom;
    }

    setTotals((prev) => {
      const updated = [...prev];
      updated[playerIndex] = newTotals;
      return updated;
    });
  };

  const calculateSectionColumnTotal = (
    playerIndex: number,
    col: number,
    row: number,
    section: Section
  ) => {
    const column = scoreTable[playerIndex].map((row) => row[col]);
    let rowsToCheck: number[] = [];
    let total = 0;

    if (section === "top") {
      rowsToCheck = [0, 1, 2, 3, 4, 5];
      const upper = rowsToCheck.reduce(
        (sum, idx) => sum + (column[idx] || 0),
        0
      );
      const bonus = upper >= 60 ? 30 : 0;
      total = upper + bonus;

      if (row === 0) calculateSectionColumnTotal(playerIndex, col, row, "mid");
    }

    if (section === "mid") {
      const max = column[7];
      const min = column[8];
      total = (max - min) * column[0];
    }

    if (section === "bottom") {
      rowsToCheck = [10, 11, 12, 13, 14];
      total = rowsToCheck.reduce((sum, idx) => sum + (column[idx] || 0), 0);
    }

    setTotals((prev) => {
      const updated = [...prev];
      const player = { ...updated[playerIndex] };
      player[section] = [...player[section]];
      player[section][col] = total;
      updated[playerIndex] = player;
      return updated;
    });
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
      <PlayerList players={players} currentPlayerIndex={currentPlayerIndex} />

      <DiceRow dice={dice} rolls={rolls} setDice={setDice} />

      <Buttons
        rolls={rolls}
        hasWrittenThisTurn={hasWrittenThisTurn}
        lockedStarCell={lockedStarCell}
        previousCell={previousCell}
        rollDice={rollDice}
        endTurn={endTurn}
        undoWriting={undoWriting}
        lockInCell={setLockedStarCell}
      />

      <ScoreTable
        totals={totals}
        scoreTable={scoreTable}
        currentPlayerIndex={currentPlayerIndex}
        handleCellClick={handleCellClick}
      />

      <Legend />
    </div>
  );
}
