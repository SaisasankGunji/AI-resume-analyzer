import React, { useContext } from "react";
import styles from "./Sidebar.module.css";
import ArticleIcon from "@mui/icons-material/Article";
import DashboardIcon from "@mui/icons-material/Dashboard";
import HistoryIcon from "@mui/icons-material/History";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../utils/AuthContext";

const Sidebar = () => {
  const location = useLocation();
  const { login, setLogin, userInfo, setUserInfo } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    setLogin(false);
    setUserInfo(null);
    navigate("/");
  };

  return (
    <div className={`${styles.sidebar}`}>
      <div className={styles.sidebarIcon}>
        <ArticleIcon sx={{ fontSize: 54, marginBottom: 2 }} />
        <div className={styles.sidebarTopContent}>Resume Screening</div>
      </div>

      <div className={styles.sidebarSections}>
        <Link
          to={"/dashboard"}
          className={`${styles.sidebarSection} ${
            location.pathname == "/dashboard" ? styles.selectedSection : null
          }`}
        >
          <DashboardIcon sx={{ fontSize: 22 }} />
          <div>Dashboard</div>
        </Link>

        <Link
          to={"/history"}
          className={`${styles.sidebarSection} ${
            location.pathname == "/history" ? styles.selectedSection : null
          }`}
        >
          <HistoryIcon sx={{ fontSize: 22 }} />
          <div>History</div>
        </Link>

        {userInfo?.role === "Admin" && (
          <Link
            to={"/admin"}
            className={`${styles.sidebarSection} ${
              location.pathname == "/admin" ? styles.selectedSection : null
            }`}
          >
            <AdminPanelSettingsIcon sx={{ fontSize: 22 }} />
            <div>Admin</div>
          </Link>
        )}

        <div onClick={handleLogout} className={styles.sidebarSection}>
          <LogoutIcon sx={{ fontSize: 22 }} />
          <div>Logout</div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
