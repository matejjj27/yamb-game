import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Player, Section, TableStore } from "../utils/types";
import {
  createEmptyPlayerTotals,
  createEmptyScoreTable,
} from "../utils/functions";

export const useTableStore = create<TableStore>()(
  persist(
    (set) => ({
      scoreTable: [],
      totals: [],
      previousCell: null,
      hasWrittenThisTurn: false,
      lockedStarCell: null,
      isStarLockClicked: false,
      setScoreTable: (table: (number | null)[][][]) =>
        set({ scoreTable: table }),
      setPreviousCell: (cell) => set({ previousCell: cell }),
      setHasWrittenThisTurn: (b) => set({ hasWrittenThisTurn: b }),
      setLockedStarCell: (cell) => set({ lockedStarCell: cell }),
      setIsStarLockClicked: (clicked) => set({ isStarLockClicked: clicked }),
      setTotals: (totals) => set({ totals }),
      calculateAndFill: (dice, playerIndex, row, col) =>
        set(({ scoreTable, calculateSectionColumnTotal }) => {
          const values = dice.map((d) => d.value);
          let score = 0;
          if (row < 6) {
            const target = row + 1;
            score = values
              .filter((v) => v === target)
              .reduce((a, b) => a + b, 0);
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
            const has5 = Object.values(counts).includes(5);
            score =
              (has3 && has2) || has5
                ? values.reduce((a, b) => a + b, 0) + 30
                : 0;
          } else if (row === 12) {
            const counts = values.reduce(
              (acc: Record<number, number>, val: number) => (
                (acc[val] = (acc[val] || 0) + 1), acc
              ),
              {}
            );
            const four = Object.entries(counts).find(
              ([_, count]) => count >= 4
            );
            score = four ? Number(four[0]) * 4 + 40 : 0;
          } else if (row === 13) {
            const first = values[0];
            if (values.every((v) => v === first)) {
              score = first * 5 + 50;
            }
          }

          const newTable = [...scoreTable];
          newTable[playerIndex][row][col] = score;
          if (row >= 0 && row <= 5) {
            calculateSectionColumnTotal(playerIndex, col, row, "top");
          } else if (row >= 7 && row <= 8) {
            calculateSectionColumnTotal(playerIndex, col, row, "mid");
          } else if (row >= 10 && row <= 14) {
            calculateSectionColumnTotal(playerIndex, col, row, "bottom");
          }
          return {
            scoreTable: newTable,
          };
        }),
      calculateSectionColumnTotal: (
        playerIndex: number,
        col: number,
        row: number,
        section: Section
      ) =>
        set(({ scoreTable, totals, calculateSectionColumnTotal }) => {
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

            if (row === 0)
              calculateSectionColumnTotal(playerIndex, col, row, "mid");
          }

          if (section === "mid") {
            const max = column[7];
            const min = column[8];
            const ones = column[0];
            if (!max || !min || !ones) total = 0;
            else total = (max - min) * ones;
          }

          if (section === "bottom") {
            rowsToCheck = [10, 11, 12, 13, 14];
            total = rowsToCheck.reduce(
              (sum, idx) => sum + (column[idx] || 0),
              0
            );
          }
          const updated = [...totals];
          const player = { ...updated[playerIndex] };
          player[section] = [...player[section]];
          player[section][col] = total;
          updated[playerIndex] = player;

          return { totals: updated };
        }),
      undoWriting: (playerIndex) =>
        set((state) => {
          const { scoreTable, previousCell, recalculateTotalsForPlayer } =
            state;
          if (!previousCell) return {};
          const [row, col] = previousCell;
          const newTable = [...scoreTable];
          newTable[playerIndex][row][col] = null;
          recalculateTotalsForPlayer(playerIndex);

          return {
            scoreTable: newTable,
            hasWrittenThisTurn: false,
            previousCell: null,
          };
        }),
      recalculateTotalsForPlayer: (playerIndex: number) =>
        set((state) => {
          const playerTable = state.scoreTable[playerIndex];
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

            newTotals.top[col] = top <= 60 ? top : top + 30;
            newTotals.mid[col] =
              max !== null && min !== null && firstRowVal !== null
                ? (max - min) * firstRowVal
                : 0;
            newTotals.bottom[col] = bottom;
          }
          const updated = [...state.totals];
          updated[playerIndex] = newTotals;

          return { totals: updated };
        }),
      initializeScoreTable: (players: Player[]) =>
        set(() => {
          return {
            scoreTable: createEmptyScoreTable(players),
            totals: createEmptyPlayerTotals(players),
          };
        }),
      resetScore: () =>
        set({
          scoreTable: [],
          totals: [],
          previousCell: null,
          hasWrittenThisTurn: false,
          lockedStarCell: null,
          isStarLockClicked: false,
        }),
    }),
    {
      name: "score-store-yamb",
    }
  )
);
