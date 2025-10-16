import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import Application from "./models/Application.js";
import Job from "./models/Job.js";

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    console.log("🧹 Clearing old data...");
    await User.deleteMany();
    await Application.deleteMany();
    await Job.deleteMany();

    console.log("🌱 Seeding fresh data...");

    // Create dummy users
    const users = await User.insertMany([
      { name: "Sneka", email: "sneka@applicant.com", password: "123456", role: "applicant" },
      { name: "Ravi Kumar", email: "ravi@applicant.com", password: "123456", role: "applicant" },
      { name: "Admin", email: "admin@hybridats.com", password: "123456", role: "admin" },
      { name: "Bot", email: "bot@hybridats.com", password: "123456", role: "bot" },
      { name: "Priya Sharma", email: "priya@applicant.com", password: "123456", role: "applicant" },
    ]);

    const admin = users.find(u => u.role === "admin");
    const bot = users.find(u => u.role === "bot");

    // Create dummy job postings
    const jobs = await Job.insertMany([
  {
    title: "Frontend Developer",
    type: "technical",
    description: "Build and maintain modern UI components using React and Tailwind.",
    createdBy: admin._id,
  },
  {
    title: "Backend Engineer",
    type: "technical",
    description: "Develop REST APIs, integrate with databases, and ensure security.",
    createdBy: admin._id,
  },
  {
    title: "HR Executive",
    type: "non-technical",
    description: "Manage recruitment, onboarding, and employee engagement.",
    createdBy: admin._id,
  },
  {
    title: "UI/UX Designer",
    type: "technical",
    description: "Design intuitive, user-centered interfaces and conduct usability testing.",
    createdBy: admin._id,
  },
  {
    title: "Marketing Associate",
    type: "non-technical",
    description: "Plan campaigns, manage social media, and analyze marketing performance.",
    createdBy: admin._id,
  },
]);


    // Create dummy applications
    const applications = await Application.insertMany([
      {
        applicant: users[0]._id,
        roleName: "Frontend Developer",
        roleType: "technical",
        status: "Interview",
        history: [{ status: "Interview", updatedBy: "admin", comment: "Round 1 done" }],
      },
      {
        applicant: users[1]._id,
        roleName: "Backend Engineer",
        roleType: "technical",
        status: "Applied",
        history: [{ status: "Applied", updatedBy: "applicant", comment: "Application submitted" }],
      },
      {
        applicant: users[4]._id,
        roleName: "HR Executive",
        roleType: "non-technical",
        status: "Reviewed",
        history: [{ status: "Reviewed", updatedBy: "admin", comment: "Screened by HR" }],
      },
    ]);

    console.log("Seeding completed!");
    console.log({
      users: users.length,
      jobs: jobs.length,
      applications: applications.length,
    });

    process.exit();
  } catch (err) {
    console.error("Seeding failed:", err.message);
    process.exit(1);
  }
};

seedData();
