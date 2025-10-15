import express from "express";
import { runBotAutomation } from "../controllers/botController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Trigger automation manually
router.post("/run", protect, runBotAutomation);

export default router;
