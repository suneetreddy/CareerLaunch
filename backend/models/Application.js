const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    applicationId: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
      index: true,
    },
    applicantName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    college: {
      type: String,
      required: true,
      trim: true,
    },
    degree: {
      type: String,
      required: true,
      trim: true,
    },
    gradYear: {
      type: String,
      default: "2026",
    },
    resumeLink: {
      type: String,
      required: true,
      trim: true,
    },
    coverNote: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected"],
      default: "Pending",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate applications for the same job by the same user
applicationSchema.index({ user: 1, job: 1 }, { unique: true });

module.exports = mongoose.model("Application", applicationSchema);
