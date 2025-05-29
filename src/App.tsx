import "./styles/App.css";
import LandingPage from "./components/LandingPage";
import Game from "./components/Game";
import { useGameStore } from "./hooks/useGameStore";
import Header from "./components/Header";

export default function App() {
  const gameStarted = useGameStore((state) => state.gameStarted);

  return (
    <div className="app-container">
      <Header />

      {gameStarted ? <Game /> : <LandingPage />}
    </div>
  );
}
