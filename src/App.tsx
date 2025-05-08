import { useState } from "react";
import "./styles/App.css";
import { v4 as uuidv4 } from "uuid";
import { ROWS, COLUMNS, MAX_ROLLS, diceDots } from "./utils/constants";
import { generateDice } from "./utils/functions";
import { PlayerTotals, Section } from "./utils/types";

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
  const [previousCell, setPreviousCell] = useState<number[] | null>(null);
  const [lockedStarCell, setLockedStarCell] = useState<number[] | null>(null);
  const [totals, setTotals] = useState<PlayerTotals[]>(
    players.map(() => ({
      top: Array(COLUMNS.length).fill(0),
      mid: Array(COLUMNS.length).fill(0),
      bottom: Array(COLUMNS.length).fill(0),
    }))
  );

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
        (acc: Record<number, number>, val: number) => ((acc[val] = (acc[val] || 0) + 1), acc),
        {}
      );
      const has3 = Object.values(counts).includes(3);
      const has2 = Object.values(counts).includes(2);
      score = has3 && has2 ? values.reduce((a, b) => a + b, 0) + 30 : 0;
    } else if (row === 12) {
      const counts = values.reduce(
        (acc: Record<number, number>, val: number) => ((acc[val] = (acc[val] || 0) + 1), acc),
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

  const undo = () => {
    if (!previousCell) return;
    const [row, col] = previousCell;
    const newTable = [...scoreTable];
    newTable[currentPlayerIndex][row][col] = null;
    setScoreTable(newTable);
    setHasWrittenThisTurn(false);
    setPreviousCell(null);
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
      const upper = rowsToCheck.reduce((sum, idx) => sum + (column[idx] || 0), 0);
      const bonus = upper >= 60 ? 30 : 0;
      total = upper + bonus;

      if (row === 0)
        calculateSectionColumnTotal(playerIndex, col, row, "mid");
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
                const active = diceDots[d.value as keyof typeof diceDots].some(
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
                      <strong>
                        {rowIdx === 6
                          ? totals[currentPlayerIndex].top[i]
                          : rowIdx === 9
                            ? totals[currentPlayerIndex].mid[i]
                            : rowIdx === 14
                              ? totals[currentPlayerIndex].bottom[i]
                              : ""}
                      </strong>
                    </td>
                  ))
                  : COLUMNS.map((_, colIdx) => (
                    <td
                      key={colIdx}
                      className={`clickable ${label === "" ? "no-border" : ""
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
          </tbody>
        </table>
      </div>

      <section className="info-panel">
        <details className="rules">
          <summary>📜 Game Rules</summary>
          <div className="rules-content">
            <p>Yamb is a dice game similar to Yahtzee, played with 5 dice and a score sheet. Each player takes turns rolling the dice up to 3 times to achieve combinations and fill in cells in different columns.</p>
            <ul>
              <li>🎲 Each turn consists of up to 3 rolls.</li>
              <li>📝 After rolling, the player must fill in one cell in the column that's currently editable.</li>
              <li>⭐ The Special column allows writing in it only when the player rolled all 5 dice on the previous roll or after locking in a cell using the lock button also after rolling all 5 dice at once.</li>
              <li>⬇️ Column must be filled top to bottom, no skipping.</li>
              <li>⬆️ Column must be filled bottom to top.</li>
              <li>⬇️⬆️ (Free column) can be filled in any order.</li>
              <li>Bonus of 30 points if the upper section total reaches 60+.</li>
              <li>Game ends when all players fill every cell.</li>
              <li>🏆 Player with the highest total score wins.</li>
            </ul>
          </div>
        </details>

        <div className="legend">
          <h3>📌 Legend</h3>
          <ul>
            <li>⬇️: Top to bottom</li>
            <li>⬆️: Bottom to top</li>
            <li>⬇️⬆️: Free column</li>
            <li>⭐: Special column</li>
            <li>S: Straight</li>
            <li>F: Full House</li>
            <li>P: Poker</li>
            <li>Y: Yamb</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
