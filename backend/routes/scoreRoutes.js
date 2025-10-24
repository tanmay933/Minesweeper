import express from "express";
import Score from "../models/Score.js";

const router = express.Router();

// ✅ GET all scores — lowest time first (best performance)
router.get("/", async (req, res) => {
  try {
    const scores = await Score.find().sort({ time: 1 }).limit(50);
    return res.json(scores);
  } catch (err) {
    console.error("Error fetching scores:", err.message);
    return res.status(500).json({ message: "Error fetching scores" });
  }
});

// ✅ POST new score
router.post("/", async (req, res) => {
  try {
    const { name, time, difficulty,result } = req.body;
    if (!name || time === undefined) {
      return res.status(400).json({ message: "Missing name or time" });
    }

    const newScore = new Score({ name, time, difficulty, result });
    await newScore.save();
    return res.status(201).json({ message: "Score saved successfully" });
  } catch (err) {
    console.error("Error saving score:", err.message);
    return res.status(500).json({ message: "Error saving score" });
  }
});

export default router;
