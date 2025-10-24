import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Game from './pages/Game';
import Leaderboard from './components/Leaderboard';

export default function App() {
  return (
    <div style={{ padding: 20, fontFamily: 'system-ui, Arial' }}>
      <nav style={{ marginBottom: 16 }}>
        <Link to="/" style={{ marginRight: 12 }}>Play</Link>
        <Link to="/leaderboard">Leaderboard</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Game />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </div>
  );
}