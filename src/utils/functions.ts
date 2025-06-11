import { COLUMNS, DICE_COUNT, ROWS } from "./constants";
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
