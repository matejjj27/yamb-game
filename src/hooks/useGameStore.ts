import { create } from "zustand";
import { persist } from "zustand/middleware";
import { GameStore } from "../utils/types";

export const useGameStore = create<GameStore>()(
  persist(
    (set) => ({
      players: [],
      currentPlayerIndex: 0,
      viewedPlayerIndex: 0,
      gameStarted: false,
      setGameStarted: (gameStarted) => set({ gameStarted }),
      setPlayers: (players) => set({ players }),
      setCurrentPlayerIndex: (index) => set({ currentPlayerIndex: index }),
      setViewedPlayerIndex: (index) => set({ viewedPlayerIndex: index }),
      resetGame: () =>
        set({
          players: [],
          currentPlayerIndex: 0,
          viewedPlayerIndex: 0,
          gameStarted: false,
        }),
    }),
    {
      name: "game-store-yamb",
    }
  )
);
