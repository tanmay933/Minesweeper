import Score from "../models/Score.js";

export const submitScore = async (req, res) => {
  try {
    const { name, time } = req.body;
    const score = new Score({ name, time });
    await score.save();
    res.json({ message: "Score submitted!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getLeaderboard = async (req, res) => {
  try {
    const scores = await Score.find().sort({ time: 1 }).limit(10);
    res.json(scores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};