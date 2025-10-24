import Challenge from "../models/Challenge.js";

const generateBoard = (rows = 9, cols = 9, mines = 10) => {
  const board = Array(rows).fill().map(() => Array(cols).fill(0));
  let placed = 0;
  while (placed < mines) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    if (board[r][c] === "M") continue;
    board[r][c] = "M";
    placed++;
  }
  return board;
};

export const getDailyChallenge = async (req, res) => {
  const today = new Date().toISOString().split("T")[0];
  let challenge = await Challenge.findOne({ date: today });

  if (!challenge) {
    challenge = new Challenge({ date: today, board: generateBoard() });
    await challenge.save();
  }

  res.json(challenge);
};
