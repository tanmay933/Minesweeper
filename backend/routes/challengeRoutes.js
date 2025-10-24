import express from "express";
import { getDailyChallenge } from "../controllers/challengeController.js";

const router = express.Router();

// GET /api/challenge - fetch today's daily board
router.get("/", getDailyChallenge);

export default router;
