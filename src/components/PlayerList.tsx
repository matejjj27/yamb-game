import React from "react";
import { PlayerListProps } from "../utils/types";

const PlayerList: React.FC<PlayerListProps> = ({
  players,
  currentPlayerIndex,
}) => {
  return (
    <div className="players">
      {players.map((player, i) => (
        <div
          key={player.id}
          className={`player ${i === currentPlayerIndex ? "active" : ""}`}
        >
          {player.name}
        </div>
      ))}
    </div>
  );
};

export default PlayerList;
