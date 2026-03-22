import React, { useState, useEffect, useRef } from "react";
import styles from "./Admin.module.css";
import Skeleton from "@mui/material/Skeleton";
import withAuthHOC from "../../utils/HOC/withAuthHOC";
import axios from "../../utils/axios";
import AlertMessage from "../AlertMessage/AlertMessage";

const Admin = () => {
  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [alert, setAlert] = useState(null);
  const [selected, setSelected] = useState(null);
  const [overlayStyle, setOverlayStyle] = useState({});
  const panelRef = useRef(null);

  useEffect(() => {
    const fetchAllUsers = async () => {
      setLoader(true);
      try {
        const result = await axios.get("/api/resume/get-resumes");
        setData(result.data.resumes);
        console.log(result.data.resumes);
      } catch (err) {
        console.log(err);
        setAlert({ type: "error", message: "Something went wrong..." });
        setTimeout(() => setAlert(null), 3000);
      } finally {
        setLoader(false);
      }
    };
    fetchAllUsers();
  }, []);

  const isMobile = () => window.innerWidth <= 780;

  const openModal = (item) => {
    if (isMobile()) return;
    const rect = panelRef.current.getBoundingClientRect();
    setOverlayStyle({
      position: "fixed",
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    });
    panelRef.current.style.overflow = "hidden";
    setSelected(item);
  };

  const closeModal = () => {
    if (panelRef.current) panelRef.current.style.overflow = "auto";
    setSelected(null);
    setOverlayStyle({});
  };

  return (
    <div className={styles.adminPage} ref={panelRef}>
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

            <h2 className={styles.modalName}>{selected.user?.name}</h2>
            <p className={styles.modalEmail}>{selected.user?.email}</p>

            <h3>Score: {selected.score}</h3>

            <h3>Feedback:</h3>
            <p>{selected.feedback}</p>

            <h3>Missing Keywords:</h3>
            <ul>
              {selected.missingKeywords?.map((item, index) => (
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
      <div className={styles.adminBlock}>
        {loader && (
          <Skeleton
            variant="rectangular"
            height={300}
            sx={{ borderRadius: "20px", gridColumn: "1 / -1" }}
          />
        )}

        {data.map((item) => (
          <div
            className={styles.adminCard}
            key={item._id}
            onClick={() => openModal(item)}
          >
            <h2 className={styles.cardName}>{item.user?.name}</h2>
            <p className={styles.cardEmail}>{item.user?.email}</p>
            <h3 className={styles.sectionTitle}>Score: {item.score}</h3>

            <h3 className={styles.sectionTitle}>Feedback:</h3>
            <p className={styles.clampText}>{item.feedback}</p>

            <h3 className={styles.sectionTitle}>Missing Keywords:</h3>
            <ul className={styles.keywordList}>
              {item.missingKeywords?.slice(0, 3).map((kw, index) => (
                <li key={index}>{kw}</li>
              ))}
              {item.missingKeywords?.length > 3 && (
                <li className={styles.moreItems}>
                  +{item.missingKeywords.length - 3} more
                </li>
              )}
            </ul>

            <p className={styles.dateText}>
              <strong>Date:</strong> {item.createdAt.slice(0, 10)}
            </p>

            <button
              className={styles.readMore}
              onClick={(e) => {
                e.stopPropagation();
                openModal(item);
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

export default withAuthHOC(Admin);
