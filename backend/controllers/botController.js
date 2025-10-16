import Application from "../models/Application.js";

/**
 * POST /api/bot/run
 * - Only allowed for bot (verifyBot)
 * - Finds technical apps not in final states, advances status one step,
 * - Returns { updatedCount, updatedApps: [{ id, roleName, oldStatus, newStatus, applicant }] }
 */
export const runBotAutomation = async (req, res) => {
  try {
    // Only technical applications not final
    const apps = await Application.find({
      roleType: "technical",
      status: { $nin: ["Offer", "Rejected"] },
    }).populate("applicant", "name email");

    if (!apps || apps.length === 0) {
      return res.json({ message: "No technical applications to update", updatedCount: 0, updatedApps: [] });
    }

    const nextStatus = { Applied: "Reviewed", Reviewed: "Interview", Interview: "Offer" };
    const updatedApps = [];

    for (const app of apps) {
      const oldStatus = app.status;
      const newStatus = nextStatus[oldStatus];
      if (!newStatus) continue; // skip if no mapping

      app.status = newStatus;
      app.history.push({
        status: newStatus,
        updatedBy: "bot",
        comment: `Bot auto-updated status to ${newStatus}`,
      });

      await app.save();

      updatedApps.push({
        id: app._id,
        roleName: app.roleName,
        oldStatus,
        newStatus,
        applicant: app.applicant
          ? { _id: app.applicant._id, name: app.applicant.name, email: app.applicant.email }
          : null,
      });
    }

    res.json({
      message: "Bot automation executed successfully",
      updatedCount: updatedApps.length,
      updatedApps,
    });
  } catch (err) {
    console.error("Bot automation error:", err);
    res.status(500).json({ message: "Bot automation failed", error: err.message });
  }
};
