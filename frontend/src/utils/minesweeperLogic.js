// Basic minesweeper board generator and actions.
// grid[r][c] = { mine: bool, revealed: bool, flagged: bool, adjacent: number }

function createEmptyGrid(rows, cols) {
  const g = new Array(rows);
  for (let r = 0; r < rows; r++) {
    g[r] = new Array(cols);
    for (let c = 0; c < cols; c++) {
      g[r][c] = { mine: false, revealed: false, flagged: false, adjacent: 0 };
    }
  }
  return g;
}

function randomPickPositions(rows, cols, mines) {
  const spots = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) spots.push([r, c]);
  }
  // simple shuffle + pick
  for (let i = spots.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [spots[i], spots[j]] = [spots[j], spots[i]];
  }
  return spots.slice(0, mines);
}

export function createGrid(rows = 9, cols = 9, mines = 10) {
  const g = createEmptyGrid(rows, cols);
  const minePos = randomPickPositions(rows, cols, mines);
  for (const [r, c] of minePos) g[r][c].mine = true;

  // compute adjacent counts
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (g[r][c].mine) continue;
      let count = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
            if (g[nr][nc].mine) count++;
          }
        }
      }
      g[r][c].adjacent = count;
    }
  }

  return g;
}

function cloneGrid(grid) {
  return grid.map((row) => row.map((c) => ({ ...c })));
}

export function revealCell(grid, r, c) {
  const rows = grid.length;
  const cols = grid[0].length;
  const newGrid = cloneGrid(grid);
  if (newGrid[r][c].revealed || newGrid[r][c].flagged) {
    return { newGrid, hitMine: false };
  }

  newGrid[r][c].revealed = true;

  if (newGrid[r][c].mine) {
    // reveal all mines
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (newGrid[i][j].mine) newGrid[i][j].revealed = true;
      }
    }
    return { newGrid, hitMine: true };
  }

  // flood fill for zero-adjacent cells
  if (newGrid[r][c].adjacent === 0) {
    const stack = [[r, c]];
    const seen = new Set([`${r},${c}`]);
    while (stack.length) {
      const [cr, cc] = stack.pop();
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = cr + dr;
          const nc = cc + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
            const key = `${nr},${nc}`;
            if (seen.has(key)) continue;
            seen.add(key);
            const cell = newGrid[nr][nc];
            if (!cell.revealed && !cell.flagged) {
              cell.revealed = true;
              if (cell.adjacent === 0 && !cell.mine) {
                stack.push([nr, nc]);
              }
            }
          }
        }
      }
    }
  }

  return { newGrid, hitMine: false };
}

export function toggleFlagOnCell(grid, r, c) {
  const newGrid = cloneGrid(grid);
  const cell = newGrid[r][c];
  if (cell.revealed) return newGrid;
  cell.flagged = !cell.flagged;
  return newGrid;
}

export function checkWin(grid) {
  // win when all non-mine cells are revealed
  for (const row of grid) {
    for (const cell of row) {
      if (!cell.mine && !cell.revealed) return false;
    }
  }
  return true;
}

export default {
  createGrid,
  revealCell,
  toggleFlagOnCell,
  checkWin,
};
