import express from "express";
import {
  createApplication,
  getMyApplications,
  updateApplicationStatus,
  getAllApplications,
} from "../controllers/applicationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Applicant routes
router.post("/", protect, createApplication);
router.get("/my", protect, getMyApplications);

// Admin routes
router.put("/:id", protect, updateApplicationStatus);
router.get("/", protect, getAllApplications);

export default router;
