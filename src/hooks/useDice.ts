import { useState } from "react";
import { Dice } from "../utils/types";
import { generateDice } from "../utils/functions";
import { MAX_ROLLS } from "../utils/constants";

export function useDice() {
  const [dice, setDice] = useState<Dice[]>(generateDice());
  const [rolls, setRolls] = useState(0);
  const [lastRollCount, setLastRollCount] = useState(5);

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
      const rolledDice = dice.filter((die) => !die.locked);
      setLastRollCount(rolledDice.length);
    }
    setRolls((r) => r + 1);
  };

  const resetDice = () => {
    setDice(generateDice());
    setRolls(0);
  };

  return {
    dice,
    setDice,
    rolls,
    lastRollCount,
    rollDice,
    resetDice,
  };
}
