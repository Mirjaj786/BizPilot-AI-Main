import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { chatWithAI } from "../controllers/aiController.js";
import { aiRateLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

router.post("/chat", authMiddleware, aiRateLimiter(10, 60 * 1000), chatWithAI);

export default router;