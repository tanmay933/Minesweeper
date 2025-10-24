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

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.get("/", (req, res) => res.json({ message: "Minesweeper API active" }));

app.use("/api/scores", scoreRoutes);

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
