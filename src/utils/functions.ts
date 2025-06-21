import { COLUMNS, DICE_COUNT, NON_SCORING_ROWS, ROWS } from "./constants";
import { v4 as uuidv4 } from "uuid";
import { Player } from "./types";

export function generateDice() {
  return Array.from({ length: DICE_COUNT }, () => ({
    value: Math.ceil(Math.random() * 6),
    locked: false,
    id: uuidv4(),
  }));
}

export const createEmptyScoreTable = (players: Player[]) =>
  players.map(() => ROWS.map(() => Array(COLUMNS.length).fill(null)));

export const createEmptyPlayerTotals = (players: Player[]) =>
  players.map(() => ({
    top: Array(COLUMNS.length).fill(0),
    mid: Array(COLUMNS.length).fill(0),
    bottom: Array(COLUMNS.length).fill(0),
  }));

export function isGameOver(scoreTable: (number | null)[][][]): boolean {
  return scoreTable.every((playerTable) =>
    playerTable.every(
      (row, rowIndex) =>
        NON_SCORING_ROWS.includes(rowIndex) ||
        row.every((cell) => cell !== null)
    )
  );
}
