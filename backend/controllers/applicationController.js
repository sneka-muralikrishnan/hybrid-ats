import Application from "../models/Application.js";

// Applicant creates an application
export const createApplication = async (req, res) => {
  try {
    const { roleName, roleType } = req.body;
    const newApp = await Application.create({
      applicant: req.user._id,
      roleName,
      roleType,
      history: [
        {
          status: "Applied",
          updatedBy: "applicant",
          comment: "Application submitted",
        },
      ],
    });
    res.status(201).json(newApp);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all applications of logged-in applicant
export const getMyApplications = async (req, res) => {
  try {
    const apps = await Application.find({ applicant: req.user._id });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin manually updates a non-technical application
export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, comment } = req.body;

    const app = await Application.findById(id);
    if (!app) return res.status(404).json({ message: "Application not found" });

    app.status = status;
    app.comments = comment;
    app.history.push({
      status,
      updatedBy: req.user.role,
      comment,
    });

    await app.save();
    res.json(app);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin gets all applications
export const getAllApplications = async (req, res) => {
  try {
    const apps = await Application.find().populate("applicant", "name email");
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
