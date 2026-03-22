const resumeModel = require("../models/Resume");
const multer = require("multer");
const pdfParse = require("pdf-parse-new");
const path = require("path");
const { CohereClient } = require("cohere-ai");
const fs = require("fs");
require("dotenv").config();

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

exports.addResume = async (req, res) => {
  try {
    const { jobDesc, user } = req.body;

    if (!req.file) {
      return res.status(400).json({
        error: "No file uploaded",
      });
    }

    const pdfPath = req.file.path;
    const dataBuffer = fs.readFileSync(pdfPath);

    const pdfData = await pdfParse(dataBuffer);

    const prompt = `
You are a resume screening assistant.

Compare the following Resume with the Job Description.

Return:
1. ATS Score (0-100)
2. Missing keywords (comma separated)
3. Suggestions (each suggestion should be in a NEW LINE, NO bullets, NO asterisks, NO markdown)

Resume:
${pdfData.text}

Job Description:
${jobDesc}

Format your response EXACTLY like:

ATS Score: XX%

Missing Keywords: keyword1, keyword2, keyword3

Suggestions:
Suggestion 1
Suggestion 2
Suggestion 3
`;

    const response = await cohere.chat({
      model: "command-a-03-2025",
      message: prompt,
      temperature: 0.7,
    });

    const result = response.text;

    // ✅ Extract ATS Score
    const match = result.match(/ATS Score:\s*(\d+)/);
    const matchScore = match ? parseInt(match[1], 10) : null;

    // ✅ Extract Suggestions (Clean + Array)
    const feedbackRegex = result.match(/Suggestions:\s*([\s\S]*)/);

    let feedback = [];

    if (feedbackRegex) {
      feedback = feedbackRegex[1]
        .split("\n")
        .map((line) =>
          line
            .replace(/[-*]/g, "") // remove bullets
            .replace(/\*\*/g, "") // remove bold
            .trim(),
        )
        .filter((line) => line.length > 0);
    }

    // ✅ Extract Missing Keywords (optional improvement)
    const keywordMatch = result.match(/Missing Keywords:\s*(.*)/);
    const missingKeywords = keywordMatch
      ? keywordMatch[1]
          .split(",")
          .map((k) => k.trim())
          .filter((k) => k.length > 0)
      : [];

    const resumeAnalysis = new resumeModel({
      user,
      resumeName: req.file.originalname,
      jobDesc,
      score: matchScore,
      feedback,
      missingKeywords,
    });

    await resumeAnalysis.save();

    // ✅ Delete uploaded file
    fs.unlinkSync(pdfPath);

    res.status(200).json({
      message: "Your resume analysis is ready",
      analysis: resumeAnalysis,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      error: "Server error",
      message: err.message,
    });
  }
};

exports.getAllResumesForUser = async (req, res) => {
  try {
    const { user } = req.params;

    const resumes = await resumeModel.find({ user }).sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Your Previous History",
      resumes,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      error: "Server error",
      message: err.message,
    });
  }
};

exports.getResumesForAdmin = async (req, res) => {
  try {
    const resumes = await resumeModel
      .find({})
      .sort({ createdAt: -1 })
      .populate("user");

    return res.status(200).json({
      message: "Successfully fetched all resumes",
      resumes,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      error: "Server error",
      message: err.message,
    });
  }
};
