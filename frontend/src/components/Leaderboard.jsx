import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

export default function Leaderboard() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);
  const location = useLocation();

  const fetchScores = async () => {
  try {
    setLoading(true);
    const res = await axios.get("/api/scores");
    const scores = res.data;
    const sorted = scores.slice().sort((a, b) => (a.time ?? 0) - (b.time ?? 0));
    setScores(sorted);
  } catch (err) {
    console.error("Leaderboard fetch error:", err);
    setError(err.message || "Error fetching scores");
    setScores([]);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    mountedRef.current = true;
    fetchScores();
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (location?.state?.refresh) {
      fetchScores();
    }
  }, [location?.state?.refresh]);

  return (
    <div style={{ padding: 20 }}>
      <h2>🏆 Leaderboard</h2>
      <div style={{ marginBottom: 12 }}>
        <button onClick={fetchScores} disabled={loading}>
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {loading ? (
        <p>Loading scores…</p>
      ) : error ? (
        <p style={{ color: "crimson" }}>{error}</p>
      ) : scores.length === 0 ? (
        <p>No scores yet — play a game to add yours.</p>
      ) : (
        <table style={{ marginTop: 12, borderCollapse: "collapse", width: "100%", maxWidth: 800 }}>
          <thead>
            <tr>
              <th style={{ padding: 6, textAlign: "left" }}>#</th>
              <th style={{ padding: 6, textAlign: "left" }}>Name</th>
              <th style={{ padding: 6, textAlign: "left" }}>Time (s)</th>
              <th style={{ padding: 6, textAlign: "left" }}>Difficulty</th>
              <th style={{ padding: 6, textAlign: "left" }}>When</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((s, i) => (
              <tr key={s._id || i}>
                <td style={{ padding: 6 }}>{i + 1}</td>
                <td style={{ padding: 6 }}>{s.name}</td>
                <td style={{ padding: 6 }}>{s.time}</td>
                <td style={{ padding: 6 }}>{s.difficulty || "-"}</td>
                <td style={{ padding: 6 }}>
                  {s.createdAt ? new Date(s.createdAt).toLocaleString() : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}