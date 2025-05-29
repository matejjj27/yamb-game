import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Player } from "../utils/types";

type GameState = {
  players: Player[];
  currentPlayer: number;
  rollCount: number;
  dice: number[];
  lockedDice: boolean[];
  gameStarted: boolean;
  setGameStarted: (gameStarted: boolean) => void;
  // Add other state fields here...
  setPlayers: (players: Player[]) => void;
  setCurrentPlayer: (index: number) => void;
  setRollCount: (count: number) => void;
  setDice: (dice: number[]) => void;
  setLockedDice: (locked: boolean[]) => void;
  resetGame: () => void;
};

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      players: [],
      currentPlayer: 0,
      rollCount: 0,
      dice: [1, 1, 1, 1, 1],
      lockedDice: [false, false, false, false, false],
      gameStarted: false,
      setGameStarted: (gameStarted) => set({ gameStarted }),
      setPlayers: (players) => set({ players }),
      setCurrentPlayer: (index) => set({ currentPlayer: index }),
      setRollCount: (count) => set({ rollCount: count }),
      setDice: (dice) => set({ dice }),
      setLockedDice: (locked) => set({ lockedDice: locked }),
      resetGame: () =>
        set({
          players: [],
          currentPlayer: 0,
          rollCount: 0,
          dice: [1, 1, 1, 1, 1],
          lockedDice: [false, false, false, false, false],
          gameStarted: false,
        }),
    }),
    {
      name: "yamb-game-storage", // key in localStorage
    }
  )
);
