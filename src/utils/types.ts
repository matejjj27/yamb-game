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
}

export interface DiceRowProps {
  dice: Dice[];
  rolls: number;
  hasWrittenThisTurn: boolean;
  setDice: React.Dispatch<React.SetStateAction<Dice[]>>;
}

export interface ButtonsProps {
  rolls: number;
  hasWrittenThisTurn: boolean;
  lockedStarCell: number[] | null;
  previousCell: number[] | null;
  currentPlayerIndex: number;
  rollDice: () => void;
  endTurn: () => void;
  undoWriting: (playerIndex: number) => void;
  lockInCell: React.Dispatch<React.SetStateAction<number[] | null>>;
}

export interface ScoreTableProps {
  totals: PlayerTotals[];
  scoreTable: any[][][];
  currentPlayerIndex: number;
  handleCellClick: (row: number, col: number) => void;
}
