import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import { protect } from "./middleware/authMiddleware.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Database connection
connectDB();

// Routes
app.use("/api/auth", authRoutes);

app.get("/api/status", (req, res) => res.send("Hybrid ATS API is running..."));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

app.get("/api/protected", protect, (req, res) => {
  res.json({ message: `Hello ${req.user.name}, you are authorized!` });
});
