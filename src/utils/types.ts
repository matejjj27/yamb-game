export type Section = "top" | "mid" | "bottom";

export type PlayerTotals = {
  top: number[];
  mid: number[];
  bottom: number[];
};

export interface Player {
  id: string;
  name: string;
}

export type Dice = {
  value: number;
  locked: boolean;
  id: string;
};

export interface PlayerListProps {
  players: Player[];
  currentPlayerIndex: number;
  setViewedPlayerIndex: (index: number) => void;
}

export interface LockedCell {
  rowId: number;
  colId: number;
}

export interface DiceRowProps {
  dice: Dice[];
  rollCount: number;
  hasWrittenThisTurn: boolean;
  isRolling: boolean;
  setDice: (dice: Dice[]) => void;
}

export interface LandingPageProps {
  onStartGame: (playerNames: string[]) => void;
}

export interface GameProps {
  newPlayers: Player[];
}

export interface ButtonsProps {
  rollCount: number;
  lastRollCount: number;
  hasWrittenThisTurn: boolean;
  previousCell: number[] | null;
  currentPlayerIndex: number;
  viewedPlayerIndex: number;
  lockedStarCell: LockedCell | null;
  isStarLockClicked: boolean;
  setIsStarLockClicked: (hasClicked: boolean) => void;
  rollDice: () => void;
  endTurn: () => void;
  undoWriting: (playerIndex: number) => void;
  lockInCell: (cell: LockedCell | null) => void;
}

export interface ScoreTableProps {
  totals: PlayerTotals[];
  scoreTable: any[][][];
  viewedPlayerIndex: number;
  lockedStarCell: LockedCell | null;
  handleCellClick: (row: number, col: number) => void;
}

export type GameStore = {
  players: Player[];
  currentPlayerIndex: number;
  viewedPlayerIndex: number;
  gameStarted: boolean;
  setGameStarted: (gameStarted: boolean) => void;
  setPlayers: (players: Player[]) => void;
  setCurrentPlayerIndex: (index: number) => void;
  setViewedPlayerIndex: (index: number) => void;
  resetGame: () => void;
};

export type DiceStore = {
  dice: Dice[];
  rollCount: number;
  lastRollCount: number;
  isRolling: boolean;
  setDice: (dice: Dice[]) => void;
  setRollCount: (count: number) => void;
  setLastRollCount: (count: number) => void;
  setIsRolling: (rolling: boolean) => void;
  rollDice: () => void;
  resetDice: () => void;
};

export type TableStore = {
  scoreTable: (number | null)[][][];
  totals: PlayerTotals[];
  previousCell: number[] | null;
  hasWrittenThisTurn: boolean;
  lockedStarCell: LockedCell | null;
  isStarLockClicked: boolean;
  setScoreTable: (table: (number | null)[][][]) => void;
  setPreviousCell: (cell: number[] | null) => void;
  setHasWrittenThisTurn: (hasWritten: boolean) => void;
  setLockedStarCell: (cell: LockedCell | null) => void;
  setIsStarLockClicked: (hasClicked: boolean) => void;
  setTotals: (totals: PlayerTotals[]) => void;
  calculateAndFill: (
    dice: Dice[],
    playerIndex: number,
    row: number,
    col: number
  ) => void;
  calculateSectionColumnTotal: (
    playerIndex: number,
    col: number,
    row: number,
    section: Section
  ) => void;
  undoWriting: (playerIndex: number) => void;
  recalculateTotalsForPlayer: (playerIndex: number) => void;
  initializeScoreTable: (players: Player[]) => void;
  resetScore: () => void;
};
