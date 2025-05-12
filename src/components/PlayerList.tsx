import React from "react";
import { PlayerListProps } from "../utils/types";

const PlayerList: React.FC<PlayerListProps> = ({
  players,
  currentPlayerIndex,
}) => {
  return (
    <div className="players">
      {players.map((player, i) => (
        <button
          key={player.id}
          className={`player ${i === currentPlayerIndex ? "active" : ""}`}
        >
          {player.name}
        </button>
      ))}
    </div>
  );
};

export default PlayerList;
