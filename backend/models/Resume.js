const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: "true",
    },
    resumeName: {
      type: String,
      required: true,
    },
    jobDesc: {
      type: String,
      required: true,
    },
    score: {
      type: String,
    },
    feedback: {
      type: [String],
    },
    missingKeywords: {
      type: [String],
    },
  },
  { timestamps: true },
);

const resumeModel = mongoose.model("resume", resumeSchema);

module.exports = resumeModel;
