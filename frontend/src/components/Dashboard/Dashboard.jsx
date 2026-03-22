import React, { useState, useContext, useRef } from "react";
import styles from "./Dashboard.module.css";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import Skeleton from "@mui/material/Skeleton";
import withAuthHOC from "../../utils/HOC/withAuthHOC";
import axios from "../../utils/axios";
import AlertMessage from "../AlertMessage/AlertMessage";
import { AuthContext } from "../../utils/AuthContext";

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDesc, setJobDesc] = useState("");
  const [fileName, setFileName] = useState("Upload Resume");
  const [alert, setAlert] = useState(null);
  const [result, setResult] = useState(null);
  const { userInfo } = useContext(AuthContext);

  const dashboardRef = useRef(null);
  const resultRef = useRef(null);

  const handleChange = (e) => {
    setResumeFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
  };

  const handleUpload = async () => {
    setResult(null);
    if (!jobDesc || !resumeFile) {
      setAlert({
        type: "error",
        message: "Please upload both resume and job description.",
      });
      setTimeout(() => setAlert(null), 3000);
      return;
    }
    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("jobDesc", jobDesc);
    formData.append("user", userInfo._id);
    setLoading(true);
    try {
      const res = await axios.post("/api/resume/add-resume", formData);
      setAlert({ type: "success", message: "Your resume analysis is ready" });
      setTimeout(() => setAlert(null), 3000);
      setResult(res.data.analysis);

      // Scroll the .dashboard div to the result card
      setTimeout(() => {
        if (resultRef.current && dashboardRef.current) {
          dashboardRef.current.scrollTo({
            top: resultRef.current.offsetTop - 20,
            behavior: "smooth",
          });
        }
      }, 150);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    const num = parseInt(score);
    if (num >= 80) return "#16a34a";
    if (num >= 60) return "#f59e0b";
    return "#dc2626";
  };

  const getScoreLabel = (score) => {
    const num = parseInt(score);
    if (num >= 80) return "Excellent Match";
    if (num >= 60) return "Good Match";
    return "Needs Improvement";
  };

  return (
    <div className={styles.dashboard} ref={dashboardRef}>
      {alert && <AlertMessage type={alert.type} message={alert.message} />}

      {/* ── Top row: side-by-side, original layout ── */}
      <div className={styles.topRow}>
        <div className={styles.dashboardLeftSection}>
          <div className={styles.dashboardHeader}>
            <div className={styles.dashboardHeading}>
              Smart Resume Screening
            </div>
            <div className={styles.dashboardSubHeading}>
              Upload your resume and job description to get an AI-generated
              match score and improvement insights.
            </div>
          </div>

          <div className={styles.alertInfo}>
            <div>🔔 Important Instructions:</div>
            <div className={styles.dashboardInstruction}>
              <div className={styles.instructionRow}>
                <span>📝</span>
                <p>
                  Please paste the complete job description in the "Job
                  Description" field before submitting.
                </p>
              </div>
              <div className={styles.instructionRow}>
                <PictureAsPdfIcon className={styles.pdfIcon} />
                <span>Only PDF format (.pdf) resumes are accepted.</span>
              </div>
            </div>
          </div>

          <div className={styles.dashboardUploadResume}>
            <div className={styles.dashboardResumeBlock}>{fileName}</div>
            <div className={styles.dashboardInputField}>
              <label htmlFor="inputField" className={styles.aiAnalyzeBtn}>
                Upload Resume
              </label>
              <input
                type="file"
                accept=".pdf"
                id="inputField"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.jobDesc}>
            <textarea
              className={styles.textArea}
              placeholder="Paste your Job Description..."
              rows={10}
              cols={50}
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
            />
            <div className={styles.analyzeBtn} onClick={handleUpload}>
              Analyze
            </div>
          </div>
        </div>

        {/* Right profile card */}
        <div className={styles.dashboardRightSection}>
          <div className={styles.rightSectionCard}>
            <p>Analyze with AI</p>
            <img
              className={styles.profileImg}
              src={userInfo?.photoUrl}
              alt="User Profile"
            />
            <h2>{userInfo?.name}</h2>
          </div>
        </div>
      </div>

      {/* ── Skeleton — full width ── */}
      {loading && (
        <Skeleton
          variant="rectangular"
          animation="wave"
          sx={{ borderRadius: "20px" }}
          height={320}
          className={styles.skeletonStyling}
        />
      )}

      {/* ── Result card — full width, below both columns ── */}
      {result && (
        <div className={styles.resultSection} ref={resultRef}>
          {/* ATS Score Hero */}
          <div
            className={styles.scoreBanner}
            style={{ "--score-color": getScoreColor(result?.score) }}
          >
            <div className={styles.scoreBannerLeft}>
              <div className={styles.scoreBannerTitle}>ATS Match Score</div>
              <div className={styles.scoreBannerSub}>
                Based on your resume vs job description
              </div>
              <div className={styles.scoreLabel}>
                {getScoreLabel(result?.score)}
              </div>
            </div>
            <div className={styles.scoreBannerRight}>
              <div
                className={styles.scoreCircle}
                style={{ borderColor: getScoreColor(result?.score) }}
              >
                <span
                  className={styles.scoreNumber}
                  style={{ color: getScoreColor(result?.score) }}
                >
                  {result?.score}
                </span>
                <span className={styles.scorePercent}>/100</span>
              </div>
            </div>
          </div>

          {/* Feedback + Keywords grid */}
          <div className={styles.resultGrid}>
            {result?.feedback?.length > 0 && (
              <div className={styles.resultCard}>
                <div className={styles.resultCardHeader}>
                  <span className={styles.resultCardIcon}>📋</span>
                  <h3>Feedback</h3>
                </div>
                <ul className={styles.feedbackList}>
                  {result.feedback.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {result?.missingKeywords?.length > 0 && (
              <div className={styles.resultCard}>
                <div className={styles.resultCardHeader}>
                  <span className={styles.resultCardIcon}>🔑</span>
                  <h3>Missing Keywords</h3>
                </div>
                <div className={styles.keywordChips}>
                  {result.missingKeywords.map((kw, index) => (
                    <span key={index} className={styles.keywordChip}>
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default withAuthHOC(Dashboard);
