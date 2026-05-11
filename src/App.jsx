import { useState } from "react";
import { useEffect } from "react";
import Board from "./components/Board";
import "./index.css";

function createEmptyGrid() {
  return Array(10)
    .fill(null)
    .map(() => Array(10).fill("empty"));
}

function placeShips(grid, ships) {
  const newGrid = grid.map((row) => [...row]);
  ships.forEach(([row, col]) => {
    newGrid[row][col] = "ship";
  });
  return newGrid;
}

const PLAYER_SHIPS = [
  [0, 0],
  [0, 1],
  [0, 2],
  [3, 5],
  [4, 5],
  [7, 7],
];
const ENEMY_SHIPS = [
  [2, 2],
  [2, 3],
  [5, 5],
  [8, 8],
  [8, 9],
];

function App() {
  const [playerGrid, setPlayerGrid] = useState(
    placeShips(createEmptyGrid(), PLAYER_SHIPS),
  );
  const [enemyGrid, setEnemyGrid] = useState(
    placeShips(createEmptyGrid(), ENEMY_SHIPS),
  );
  const [log, setLog] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [serverTime, setServerTime] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/api/time")
      .then((res) => res.json())
      .then((data) => setServerTime(data.time));
  }, []);

  function addLog(text, type) {
    setLog((prev) => [{ text, type }, ...prev]);
  }

  function checkWin(grid, winner) {
    if (!grid.some((row) => row.includes("ship"))) {
      setGameOver(true);
      addLog(
        winner === "player" ? "🏆 Ты победил!" : "💀 Компьютер победил!",
        "hit",
      );
      return true;
    }
    return false;
  }

  function computerMove(currentPlayerGrid) {
    const available = [];
    for (let r = 0; r < 10; r++) {
      for (let c = 0; c < 10; c++) {
        if (
          currentPlayerGrid[r][c] !== "hit" &&
          currentPlayerGrid[r][c] !== "miss"
        ) {
          available.push([r, c]);
        }
      }
    }

    if (available.length === 0) return;

    const [row, col] = available[Math.floor(Math.random() * available.length)];
    const newGrid = currentPlayerGrid.map((r) => [...r]);

    if (currentPlayerGrid[row][col] === "ship") {
      newGrid[row][col] = "hit";
      addLog(`Компьютер попал! [${row}, ${col}]`, "hit");
    } else {
      newGrid[row][col] = "miss";
      addLog(`Компьютер промазал [${row}, ${col}]`, "miss");
    }

    if (checkWin(newGrid, "computer")) return;

    setPlayerGrid(newGrid);
  }

  function handleEnemyClick(row, col) {
    if (gameOver) return;
    if (enemyGrid[row][col] === "hit" || enemyGrid[row][col] === "miss") return;

    const newGrid = enemyGrid.map((r) => [...r]);

    if (enemyGrid[row][col] === "ship") {
      newGrid[row][col] = "hit";
      addLog(`Ты попал! [${row}, ${col}]`, "hit");
      setEnemyGrid(newGrid);
      if (checkWin(newGrid, "player")) return;
    } else {
      newGrid[row][col] = "miss";
      addLog(`Ты промазал [${row}, ${col}]`, "miss");
      setEnemyGrid(newGrid);
      computerMove(playerGrid);
    }
  }

  function resetGame() {
    setPlayerGrid(placeShips(createEmptyGrid(), PLAYER_SHIPS));
    setEnemyGrid(placeShips(createEmptyGrid(), ENEMY_SHIPS));
    setLog([]);
    setGameOver(false);
  }

  return (
    <div>
      <h1>Морской бой</h1>
      {serverTime && (
        <p>Время сервера: {new Date(serverTime).toLocaleTimeString()}</p>
      )}
      <div className="game">
        <div>
          <h2>Твоё поле</h2>
          <Board grid={playerGrid} onCellClick={() => {}} />
        </div>

        <div>
          <h2>Поле врага</h2>
          <Board
            grid={enemyGrid}
            onCellClick={handleEnemyClick}
            hideShips={true}
          />
        </div>

        <div className="log">
          <h2>Лог</h2>
          {gameOver && <button onClick={resetGame}>Новая игра</button>}
          {log.map((entry, i) => (
            <div key={i} className={`log-entry ${entry.type}`}>
              {entry.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
