import React from "react";
import { PlayerListProps } from "../utils/types";

const PlayerList: React.FC<PlayerListProps> = ({
  players,
  currentPlayerIndex,
  setViewedPlayerIndex,
}) => {
  return (
    <div className="players">
      {players.map((player, idx) => (
        <div
          key={player.id}
          className={`player ${idx === currentPlayerIndex ? "active" : ""}`}
          onClick={() => setViewedPlayerIndex(idx)}
        >
          {player.name}
        </div>
      ))}
    </div>
  );
};

export default PlayerList;
