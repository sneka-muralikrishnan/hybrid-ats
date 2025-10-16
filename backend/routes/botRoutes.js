import express from "express";
import { runBotAutomation } from "../controllers/botController.js";
import { protect, verifyBot } from "../middleware/authMiddleware.js";


const router = express.Router();

router.post("/run", protect, verifyBot, runBotAutomation);

export default router;
