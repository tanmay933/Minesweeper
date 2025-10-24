import React from "react";

export default function Cell({ cell, onClick, onRightClick }) {
  const { revealed, flagged, mine, adjacent } = cell;

  function handleContext(e) {
    e.preventDefault();
    onRightClick();
  }

  return (
    <div
      className={`cell ${revealed ? "revealed" : ""}`}
      onClick={onClick}
      onContextMenu={handleContext}
      title={flagged ? "Flagged" : ""}
    >
      {!revealed && flagged ? "🚩" : null}
      {revealed && mine ? "💣" : null}
      {revealed && !mine && adjacent > 0 ? adjacent : null}
    </div>
  );
}
