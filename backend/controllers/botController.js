import Application from "../models/Application.js";

// 🧠 BOT MIMIC: Automatically updates technical applications
export const runBotAutomation = async (req, res) => {
  try {
    // Only bot role can trigger automation
    if (req.user.role !== "bot") {
      return res.status(403).json({ message: "Access denied: Only bot can run automation" });
    }

    // Find all technical applications not yet at final stage
    const technicalApps = await Application.find({
      roleType: "technical",
      status: { $nin: ["Offer", "Rejected"] },
    });

    const nextStatus = {
      Applied: "Reviewed",
      Reviewed: "Interview",
      Interview: "Offer",
    };

    // Loop through apps and update their statuses
    for (let app of technicalApps) {
      const newStatus = nextStatus[app.status];
      if (newStatus) {
        app.status = newStatus;
        app.history.push({
          status: newStatus,
          updatedBy: "bot",
          comment: `Bot auto-updated status to ${newStatus}`,
        });
        await app.save();
      }
    }

    res.json({
      message: "Bot automation executed successfully",
      updatedCount: technicalApps.length,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
