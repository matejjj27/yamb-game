export const DICE_COUNT = 5;
export const MAX_ROLLS = 3;
export const NON_SCORING_ROWS = [6, 9, 14];
export const COLUMNS = ["⬇️", "⬇️⬆️", "⬆️", "⭐"];
export const ROWS = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "",
  "Max",
  "Min",
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

// for testing purposes
export const filledScoreTable: (number | null)[][][] = [
  // Player 1
  [
    [1, 2, 3, 4], // Row 0
    [5, 6, 7, 8], // Row 1
    [9, 10, 11, 12], // Row 2
    [13, 14, 15, 16], // Row 3
    [17, 18, 19, 20], // Row 4
    [21, 22, 23, 24], // Row 5
    [null, null, null, null], // Row 6 (totals row)
    [25, 26, 27, 28], // Row 7
    [29, 30, 31, 32], // Row 8
    [null, null, null, null], // Row 9 (totals row)
    [33, 34, 35, 36], // Row 10
    [37, 38, 39, 40], // Row 11
    [41, 42, 43, 44], // Row 12
    [45, 46, 47, 48], // Row 13
    [null, null, null, null], // Row 14 (totals row)
  ],

  // Player 2
  [
    [6, 7, 8, 9], // Row 0
    [10, 11, 12, 13], // Row 1
    [14, 15, 16, 17], // Row 2
    [18, 19, 20, 21], // Row 3
    [22, 23, 24, 25], // Row 4
    [26, 27, 28, 29], // Row 5
    [null, null, null, null], // Row 6
    [30, 31, 32, 33], // Row 7
    [34, 35, 36, 37], // Row 8
    [null, null, null, null], // Row 9
    [38, 39, 40, 41], // Row 10
    [42, 43, 44, 45], // Row 11
    [46, 47, 48, 49], // Row 12
    [50, 51, 52, 53], // Row 13
    [null, null, null, null], // Row 14
  ],
];
