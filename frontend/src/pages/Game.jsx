import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Board from "../components/Board";
import Timer from "../components/Timer";
import {
  createGrid,
  revealCell,
  toggleFlagOnCell,
  checkWin,
} from "../utils/minesweeperLogic";

// ✅ use absolute backend URL for development
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5001";

export default function Game() {
  const [grid, setGrid] = useState([]);
  const [running, setRunning] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [time, setTime] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [difficulty, setDifficulty] = useState("Beginner");

  // ✅ Player name stored locally
  const [playerName, setPlayerName] = useState(() => {
    try {
      return localStorage.getItem("playerName") || "";
    } catch {
      return "";
    }
  });

  const navigate = useNavigate();

  const difficultySettings = {
    Beginner: { rows: 9, cols: 9, mines: 10 },
    Intermediate: { rows: 16, cols: 16, mines: 40 },
    Expert: { rows: 16, cols: 30, mines: 99 },
  };

  const startNewGame = () => {
    let name = playerName;
    if (!name) {
      name = prompt("Enter your name to start playing:")?.trim();
      if (!name) return;
      setPlayerName(name);
      try {
        localStorage.setItem("playerName", name);
      } catch {}
    }

    const { rows, cols, mines } = difficultySettings[difficulty];
    setGrid(createGrid(rows, cols, mines));
    setRunning(true);
    setGameOver(false);
    setResetKey((k) => k + 1);
    setTime(0);
  };

  useEffect(() => {
    if (playerName) {
      startNewGame();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty]);

  const handleReveal = (r, c) => {
    if (gameOver || !running) return;
    const { newGrid, hitMine } = revealCell(grid, r, c);
    setGrid(newGrid);

    if (hitMine) {
      setRunning(false);
      setGameOver(true);
      alert(`💥 Boom! You hit a mine! Your time was ${time}s`);
      handleGameEnd(false); // Handle loss
    } else if (checkWin(newGrid)) {
      setRunning(false);
      setGameOver(true);
      handleWin();
    }
  };

  const handleFlag = (r, c) => {
    if (gameOver || !running) return;
    setGrid(toggleFlagOnCell(grid, r, c));
  };

  const handleGameEnd = async (isWin = true) => {
    if (isWin) {
      alert(`🎉 You win in ${time}s!`);
    }
    
    let nameToUse = playerName;
    if (!nameToUse) {
      nameToUse = prompt("Enter your name for leaderboard:")?.trim();
      if (!nameToUse) return;
      setPlayerName(nameToUse);
      try {
        localStorage.setItem("playerName", nameToUse);
      } catch {}
    }

    try {
      // ✅ fixed: absolute URL ensures it hits backend port 5001
      const res = await fetch(`${API_BASE}/api/scores`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: nameToUse, 
          time, 
          difficulty,
          result: isWin ? "win" : "loss"  // Adding game result
        }),
      });

      if (res.ok) {
        alert(isWin ? "🏆 Score submitted!" : "💣 Score recorded!");
        navigate("/leaderboard", { state: { refresh: Date.now() } });
      } else {
        const body = await res.json().catch(() => ({}));
        console.error("Submit failed:", res.status, body);
        alert("Failed to submit score: " + (body.message || res.statusText));
      }
    } catch (err) {
      console.error("Error submitting score:", err);
      alert("Server error — could not submit score.");
    }
  };

  const handleWin = () => handleGameEnd(true);

  return (
    <div className="app">
      <header className="app-header">
        <h2>Minesweeper</h2>
        <div className="controls">
          <label style={{ marginRight: 8 }}>
            Name:
            <input
              type="text"
              value={playerName}
              onChange={(e) => {
                const v = e.target.value;
                setPlayerName(v);
                try {
                  localStorage.setItem("playerName", v);
                } catch {}
              }}
              placeholder="Your name"
              style={{ marginLeft: 6 }}
            />
          </label>
          <label>Difficulty:</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Expert</option>
          </select>
          <button onClick={startNewGame}>New Game</button>
          <Timer
            running={running && !gameOver}
            resetKey={resetKey}
            onTime={setTime}
          />
        </div>
      </header>

      <Board grid={grid} onReveal={handleReveal} onToggleFlag={handleFlag} />
    </div>
  );
}