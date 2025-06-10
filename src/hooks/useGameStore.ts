import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Player } from "../utils/types";

type GameState = {
  players: Player[];
  currentPlayer: number;
  gameStarted: boolean;
  setGameStarted: (gameStarted: boolean) => void;
  setPlayers: (players: Player[]) => void;
  setCurrentPlayer: (index: number) => void;
  resetGame: () => void;
};

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      players: [],
      currentPlayer: 0,
      gameStarted: false,
      setGameStarted: (gameStarted) => set({ gameStarted }),
      setPlayers: (players) => set({ players }),
      setCurrentPlayer: (index) => set({ currentPlayer: index }),
      resetGame: () =>
        set({
          players: [],
          currentPlayer: 0,
          gameStarted: false,
        }),
    }),
    {
      name: "yamb-game-data",
    }
  )
);
