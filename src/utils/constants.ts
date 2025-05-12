import { v4 as uuidv4 } from "uuid";

export const DICE_COUNT = 5;
export const MAX_ROLLS = 3;
export const COLUMNS = ["⬇️", "⬇️⬆️", "⬆️", "⭐"];
export const samplePlayers = [
  { id: uuidv4(), name: "Player 1" },
  { id: uuidv4(), name: "Player 2" },
];
export const ROWS = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "",
  "MAX",
  "MIN",
  "",
  "S",
  "F",
  "P",
  "Y",
  "",
];
export const diceDots = {
  1: [[1, 1]],
  2: [
    [0, 0],
    [2, 2],
  ],
  3: [
    [0, 0],
    [1, 1],
    [2, 2],
  ],
  4: [
    [0, 0],
    [0, 2],
    [2, 0],
    [2, 2],
  ],
  5: [
    [0, 0],
    [0, 2],
    [1, 1],
    [2, 0],
    [2, 2],
  ],
  6: [
    [0, 0],
    [1, 0],
    [2, 0],
    [0, 2],
    [1, 2],
    [2, 2],
  ],
};
