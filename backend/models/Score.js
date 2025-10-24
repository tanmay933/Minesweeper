import mongoose from "mongoose";

const ScoreSchema = new mongoose.Schema({
  name: { type: String, required: true },
  time: { type: Number, required: true },
  difficulty: { type: String, default: "Beginner" },
  result: {type: String, enum: ['win','loss'],default: 'loss'},
  createdAt: { type: Date, default: Date.now },
});

const Score = mongoose.model("Score", ScoreSchema);
export default Score;