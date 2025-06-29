import React, { useState } from "react";
import { useGameStore } from "../hooks/useGameStore";
import { useTableStore } from "../hooks/useTableStore";

const LandingPage: React.FC = () => {
  const [numPlayers, setNumPlayers] = useState(2);
  const [playerNames, setPlayerNames] = useState(["", ""]);
  const [error, setError] = useState("");
  const { setPlayers, setGameStarted } = useGameStore();
  const { initializeScoreTable } = useTableStore();

  const startGame = (names: string[]) => {
    const players = names.map((name) => ({
      id: crypto.randomUUID(),
      name,
    }));
    initializeScoreTable(players);
    setPlayers(players);
    setGameStarted(true);
  };

  const handleNumPlayersChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const count = parseInt(e.target.value, 10);
    setNumPlayers(count);
    setPlayerNames(Array(count).fill(""));
    setError("");
  };

  const handleNameChange = (index: number, value: string) => {
    const names = [...playerNames];
    names[index] = value;
    setPlayerNames(names);
    setError("");
  };

  const handleStartGame = () => {
    if (playerNames.every((name) => name.trim() !== "")) {
      startGame(playerNames);
    } else {
      setError("⚠️ Please enter all player names.");
    }
  };

  return (
    <div className="landing-container">
      <header className="landing-header">
        <h1 className="landing-title">🎲 Yamb Game</h1>
        <p className="landing-subtitle">Setup your game and get rolling!</p>
      </header>
      <div className="form-section">
        <label className="form-label">
          Number of Players:
          <select
            value={numPlayers}
            onChange={handleNumPlayersChange}
            className="player-select"
          >
            {[2, 3, 4, 5, 6].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </label>

        <div className="player-inputs-grid">
          {playerNames.map((name, index) => (
            <div key={index} className="input-wrapper">
              <label className="form-label">
                Player {index + 1} Name:
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(index, e.target.value)}
                  className="player-name-input"
                  placeholder={`Player ${index + 1}`}
                />
              </label>
            </div>
          ))}
        </div>

        {error && <div className="error-message">{error}</div>}

        <button className="start-button" onClick={handleStartGame}>
          🚀 Start Game
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
