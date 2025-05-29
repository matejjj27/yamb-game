import "./styles/App.css";
import LandingPage from "./components/LandingPage";
import Game from "./components/Game";
import { useGameStore } from "./hooks/useGameStore";
import Header from "./components/Header";

export default function App() {
  const newPlayers = useGameStore((state) => state.players);
  const setNewPlayers = useGameStore((state) => state.setPlayers);
  const gameStarted = useGameStore((state) => state.gameStarted);
  const setGameStarted = useGameStore((state) => state.setGameStarted);

  const startGame = (names: string[]) => {
    const players = names.map((name) => ({
      id: crypto.randomUUID(),
      name,
    }));
    setNewPlayers(players);
    setGameStarted(true);
  };

  return (
    <div className="app-container">
      <Header />

      {gameStarted ? (
        <Game newPlayers={newPlayers} />
      ) : (
        <LandingPage onStartGame={startGame} />
      )}
    </div>
  );
}
