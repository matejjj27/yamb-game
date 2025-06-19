import { create } from "zustand";
import { DiceStore } from "../utils/types";
import { generateDice } from "../utils/functions";
import { MAX_ROLLS } from "../utils/constants";
import { persist } from "zustand/middleware";

export const useDiceStore = create<DiceStore>()(
  persist(
    (set, get) => ({
      dice: generateDice(),
      rollCount: 0,
      lastRollCount: 5,
      isRolling: false,
      setDice: (dice) => set({ dice }),
      setRollCount: (count) => set({ rollCount: count }),
      setLastRollCount: (count) => set({ lastRollCount: count }),
      setIsRolling: (rolling) => set({ isRolling: rolling }),
      rollDice: () => {
        const {
          dice,
          rollCount,
          setIsRolling,
          setDice,
          setRollCount,
          setLastRollCount,
        } = get();

        if (rollCount >= MAX_ROLLS) return;
        if (rollCount === 0) {
          setIsRolling(true);

          const tempDice = dice.map((d) =>
            d.locked ? d : { ...d, value: Math.ceil(Math.random() * 6) }
          );
          setDice(tempDice);

          setTimeout(() => {
            setDice(generateDice());
            setIsRolling(false);
          }, 300);
        } else {
          setIsRolling(true);
          setTimeout(() => {
            setDice(
              dice.map((d) =>
                d.locked ? d : { ...d, value: Math.ceil(Math.random() * 6) }
              )
            );
            const rolledDice = dice.filter((die) => !die.locked);
            setLastRollCount(rolledDice.length);
            setIsRolling(false);
          }, 300);
        }
        setRollCount(rollCount + 1);
      },
      resetDice: () =>
        set({
          dice: generateDice(),
          rollCount: 0,
          lastRollCount: 5,
        }),
    }),
    {
      name: "dice-store-yamb",
    }
  )
);
