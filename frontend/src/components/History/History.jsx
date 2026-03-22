import React, { useState, useEffect, useContext, useRef } from "react";
import styles from "./History.module.css";
import Skeleton from "@mui/material/Skeleton";
import withAuthHOC from "../../utils/HOC/withAuthHOC";
import axios from "../../utils/axios";
import AlertMessage from "../AlertMessage/AlertMessage";
import { AuthContext } from "../../utils/AuthContext";

const History = () => {
  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [alert, setAlert] = useState(null);
  const [selected, setSelected] = useState(null);
  const [overlayStyle, setOverlayStyle] = useState({});
  const panelRef = useRef(null);
  const { userInfo } = useContext(AuthContext);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoader(true);
      try {
        const result = await axios.get(
          `/api/resume/get-resumes/${userInfo?._id}`,
        );
        console.log(result.data.resumes);
        setData(result.data.resumes);
      } catch (err) {
        console.log(err);
        setAlert({
          type: "error",
          message: "Unable to fetch resume history...",
        });
        setTimeout(() => setAlert(null), 3000);
      } finally {
        setLoader(false);
      }
    };
    fetchUserData();
  }, []);

  const isMobile = () => window.innerWidth <= 780;

  const openModal = (resume) => {
    if (isMobile()) return;
    // Measure the panel's current position in the viewport
    const rect = panelRef.current.getBoundingClientRect();
    setOverlayStyle({
      position: "fixed",
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    });
    // Lock scroll on the panel
    panelRef.current.style.overflow = "hidden";
    setSelected(resume);
  };

  const closeModal = () => {
    // Restore scroll
    if (panelRef.current) panelRef.current.style.overflow = "auto";
    setSelected(null);
    setOverlayStyle({});
  };

  return (
    <div className={styles.history} ref={panelRef}>
      {alert && <AlertMessage type={alert.type} message={alert.message} />}

      {/* ── Modal ── */}
      {selected && (
        <div
          className={styles.modalOverlay}
          style={overlayStyle}
          onClick={closeModal}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles.modalClose} onClick={closeModal}>
              ✕
            </button>

            <div className={styles.modalPercentage}>{selected.score} %</div>

            <p>
              <strong>Resume Name:</strong> {selected.resumeName}
            </p>

            <h3>Feedback:</h3>
            <p>{selected.feedback}</p>

            <h3>Missing Keywords:</h3>
            <ul>
              {selected.missingKeywords.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <p>
              <strong>Date:</strong> {selected.createdAt.slice(0, 10)}
            </p>
          </div>
        </div>
      )}

      {/* ── Cards ── */}
      <div className={styles.historyCardBlock}>
        {loader && (
          <Skeleton
            variant="rectangular"
            height={300}
            sx={{ borderRadius: "20px", gridColumn: "1 / -1" }}
          />
        )}

        {data.map((resume) => (
          <div
            className={styles.historyCard}
            key={resume._id}
            onClick={() => openModal(resume)}
          >
            <div className={styles.cardPercentage}>{resume.score} %</div>

            <p className={styles.resumeName}>
              <strong>Resume Name:</strong> {resume.resumeName}
            </p>

            <h3 className={styles.sectionTitle}>Feedback:</h3>
            <p className={styles.clampText}>{resume.feedback}</p>

            <h3 className={styles.sectionTitle}>Missing Keywords:</h3>
            <ul className={styles.keywordList}>
              {resume.missingKeywords.slice(0, 3).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
              {resume.missingKeywords.length > 3 && (
                <li className={styles.moreItems}>
                  +{resume.missingKeywords.length - 3} more
                </li>
              )}
            </ul>

            <p className={styles.dateText}>
              <strong>Date:</strong> {resume.createdAt.slice(0, 10)}
            </p>

            <button
              className={styles.readMore}
              onClick={(e) => {
                e.stopPropagation();
                openModal(resume);
              }}
            >
              Read more →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default withAuthHOC(History);
