import { create } from "zustand";
import { persist } from "zustand/middleware";
import { GameStore } from "../utils/types";

export const useGameStore = create<GameStore>()(
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
      name: "game-store-yamb",
    }
  )
);
