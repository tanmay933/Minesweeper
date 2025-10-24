import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import scoreRoutes from "./routes/scoreRoutes.js";
import { submitScore } from "./controllers/scoreController.js";

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5001;

const allowedOrigins = [
  "http://localhost:5173",                     // local dev
  "https://minesweeper-frontend-lto2.onrender.com" // deployed frontend
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
}));

app.use(express.json());

app.get("/", (req, res) => res.json({ message: "Minesweeper API active" }));

app.use("/api/scores", scoreRoutes);

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
