import { DICE_COUNT } from "./constants";
import { v4 as uuidv4 } from "uuid";

export function generateDice() {
  return Array.from({ length: DICE_COUNT }, () => ({
    value: Math.ceil(Math.random() * 6),
    locked: false,
    id: uuidv4(),
  }));
}
