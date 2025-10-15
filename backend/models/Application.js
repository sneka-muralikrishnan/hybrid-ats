import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  roleName: {
    type: String,
    required: true, // e.g. "Frontend Developer"
  },
  roleType: {
    type: String,
    enum: ["technical", "non-technical"],
    required: true,
  },
  status: {
    type: String,
    enum: ["Applied", "Reviewed", "Interview", "Offer", "Rejected"],
    default: "Applied",
  },
  comments: { type: String },
  history: [
    {
      status: String,
      updatedBy: { type: String }, // applicant/admin/bot
      comment: String,
      timestamp: { type: Date, default: Date.now },
    },
  ],
}, { timestamps: true });

const Application = mongoose.model("Application", applicationSchema);
export default Application;
