import express from "express";
import Job from "../models/Job.js";
import { protect, verifyAdmin, verifyBot} from "../middleware/authMiddleware.js";

const router = express.Router();

// Create Job (Admin only)
router.post("/", protect, verifyAdmin, async (req, res) => {
  try {
    const { title, type, description } = req.body;
    const job = await Job.create({
      title,
      type,
      description,
      createdBy: req.user.id,
    });
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: "Failed to create job", error: err.message });
  }
});

// ✅ Get all Jobs (Everyone)
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching jobs" });
  }
});

// ✅ Delete Job (Admin only)
router.delete("/:id", protect, verifyAdmin, async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting job" });
  }
});

export default router;
