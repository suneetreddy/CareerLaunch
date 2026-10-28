const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    color: {
      type: String,
      default: "#4f46e5",
    },
    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["Internship", "Full-time", "Part-time"],
      index: true,
    },
    pay: {
      type: String,
      required: true,
      trim: true,
    },
    posted: {
      type: String,
      default: "Recently",
    },
    featured: {
      type: Boolean,
      default: false,
    },
    summary: {
      type: String,
      required: true,
    },
    about: {
      type: String,
      required: true,
    },
    responsibilities: {
      type: [String],
      default: [],
    },
    requirements: {
      type: [String],
      default: [],
    },
    skills: {
      type: [String],
      default: [],
    },
    legacyId: {
      type: Number,
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

jobSchema.index({ title: 1, company: 1 });

module.exports = mongoose.model("Job", jobSchema);
