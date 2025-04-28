import { useState } from "react";
import "./index.css";
import { v4 as uuidv4 } from "uuid";
import { ROWS, COLUMNS, MAX_ROLLS, diceDots } from "./utils/constants";
import { generateDice } from "./utils/functions";

export default function App() {
  const [players] = useState([
    { id: uuidv4(), name: "Player 1" },
    { id: uuidv4(), name: "Player 2" }
  ]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [dice, setDice] = useState(generateDice());
  const [rolls, setRolls] = useState(0);
  const [hasWrittenThisTurn, setHasWrittenThisTurn] = useState(false);
  const [scoreTable, setScoreTable] = useState(
    players.map(() => ROWS.map(() => Array(COLUMNS.length).fill(null)))
  );
  const [previousCell, setPreviousCell] = useState(null);
  const [lockedStarCell, setLockedStarCell] = useState<number[] | null>(null);

  const toggleLock = (id: string) => {
    if (rolls === 0) return;
    setDice((prev) =>
      prev.map((d) => (d.id === id ? { ...d, locked: !d.locked } : d))
    );
  };

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
    console.log("before clicked");
    if (ROWS[row] === "") return;
    if (hasWrittenThisTurn) return;

    const rolledAllDice = dice.every((d) => !d.locked);

    if (col === 3) {
      const canWrite =
        (lockedStarCell?.[0] === row && lockedStarCell?.[1] === col) ||
        (rolls > 0 && rolledAllDice && !lockedStarCell);

      if (!canWrite) return;
    } else if (!isCellEditable(row, col)) {
      console.log("clicked");
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
        (val, id) => val === null && id !== 4 && id !== 7
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
    console.log(row, col, "calculateAndFill");

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
        (acc, val) => ((acc[val] = (acc[val] || 0) + 1), acc),
        {}
      );
      const has3 = Object.values(counts).includes(3);
      const has2 = Object.values(counts).includes(2);
      score = has3 && has2 ? values.reduce((a, b) => a + b, 0) + 30 : 0;
    } else if (row === 12) {
      const counts = values.reduce(
        (acc, val) => ((acc[val] = (acc[val] || 0) + 1), acc),
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
  };

  const undo = () => {
    if (!previousCell) return;
    const [row, col] = previousCell;
    const newTable = [...scoreTable];
    newTable[currentPlayerIndex][row][col] = null;
    setScoreTable(newTable);
    setHasWrittenThisTurn(false);
    setPreviousCell(null);
  };

  const calculateColumnGrandTotal = (col: number) => {
    const column = scoreTable[currentPlayerIndex].map((row) => row[col]);
    const upper = column.slice(0, 6).reduce((a, b) => a + (b || 0), 0);
    const upperBonus = upper >= 60 ? 30 : 0;
    const max = column[7] || 0;
    const min = column[8] || 0;
    const ones = column[0] || 0;
    const oneCount = ones / 1;
    const middle = (max - min) * oneCount;
    const lower = column.slice(10).reduce((a, b) => a + (b || 0), 0);
    return upper + upperBonus + middle + lower;
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
      <div className="players">
        {players.map((player, i) => (
          <div
            key={player.id}
            className={`player ${i === currentPlayerIndex ? "active" : ""}`}
          >
            {player.name}
          </div>
        ))}
      </div>

      <div className="dice-row">
        {dice.map((d) => (
          <div
            key={d.id}
            className={`die ${d.locked ? "locked" : ""}`}
            onClick={() => toggleLock(d.id)}
          >
            {[0, 1, 2].map((r) =>
              [0, 1, 2].map((c) => {
                const active = diceDots[d.value].some(
                  ([dr, dc]) => dr === r && dc === c
                );
                return (
                  <div
                    key={`${r}${c}`}
                    className={`dot ${active ? "active" : ""}`}
                  />
                );
              })
            )}
          </div>
        ))}
      </div>

      <div className="buttons">
        <button
          className="primary"
          onClick={rollDice}
          disabled={rolls >= MAX_ROLLS}
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
        <button className="primary" onClick={undo} disabled={!previousCell}>
          Undo
        </button>
        <button
          className="primary"
          onClick={() => {
            const cell = prompt("Lock in row number (1–14) for ⭐ column:");
            if (cell && !hasWrittenThisTurn) {
              setLockedStarCell([+cell - 1, 3]);
            }
          }}
        >
          ⭐ Lock
        </button>
      </div>

      <div className="table-container">
        <table className="score-table">
          <thead>
            <tr>
              <th className="no-border"></th>
              {COLUMNS.map((c, i) => (
                <th key={i} className="no-border">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((label, rowIdx) => (
              <tr key={rowIdx} className={label === "" ? "empty-row" : ""}>
                <td className={label === "" ? "" : "no-border label"}>
                  {label}
                </td>
                {label === ""
                  ? COLUMNS.map((_, i) => (
                      <td key={i} className="total">
                        <strong>{calculateColumnGrandTotal(i)}</strong>
                      </td>
                    ))
                  : COLUMNS.map((_, colIdx) => (
                      <td
                        key={colIdx}
                        className={`clickable ${
                          label === "" ? "no-border" : ""
                        }`}
                        onClick={() => handleCellClick(rowIdx, colIdx)}
                      >
                        {label !== ""
                          ? scoreTable[currentPlayerIndex][rowIdx][colIdx] ?? ""
                          : ""}
                      </td>
                    ))}
              </tr>
            ))}
            <tr>
              <td className="total">
                <strong>Total</strong>
              </td>
              {COLUMNS.map((_, i) => (
                <td key={i} className="total">
                  <strong>{calculateColumnGrandTotal(i)}</strong>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <details className="rules">
        <summary>📜 Rules</summary>
        <p>Basic Yamb rules go here...</p>
      </details>

      <div className="legend">
        <h3>Legend:</h3>
        <p>⬇️: Top to bottom</p>
        <p>⬆️: Bottom to top</p>
        <p>⬇️⬆️: Free column</p>
        <p>⭐: Special column</p>
        <p>S: Straight, F: Full House, P: Poker, Y: Yamb</p>
      </div>
    </div>
  );
}
