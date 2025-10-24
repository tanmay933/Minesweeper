import axios from "axios";

export const saveScore = async (score) => {
  try {
    const res = await axios.post("/api/scores", score);
    return res.data;
  } catch (err) {
    console.error("Error saving score:", err);
    throw err;
  }
};

export const getScores = async () => {
  try {
    const res = await axios.get("/api/scores");
    return res.data;
  } catch (err) {
    console.error("Error fetching scores:", err);
    throw err;
  }
};