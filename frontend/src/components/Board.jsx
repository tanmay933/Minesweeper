import React from "react";
import Cell from "./Cell";

export default function Board({ grid, onReveal, onToggleFlag }) {
  return (
    <div className="board" role="grid">
      {grid.map((row, rIdx) => (
        <div className="row" key={rIdx} role="row">
          {row.map((cell, cIdx) => (
            <Cell
              key={cIdx}
              cell={cell}
              onClick={() => onReveal(rIdx, cIdx)}
              onRightClick={() => onToggleFlag(rIdx, cIdx)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
