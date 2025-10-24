import mongoose from "mongoose";

const challengeSchema = new mongoose.Schema({
  date: { type: String, unique: true },
  board: { type: Array, required: true },
});

export default mongoose.model("Challenge", challengeSchema);
