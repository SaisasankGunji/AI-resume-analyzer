import React from "react";
import styles from "./AlertMessage.module.css";
import {
  AiOutlineCheckCircle,
  AiOutlineCloseCircle,
  AiOutlineLoading3Quarters,
} from "react-icons/ai";

const AlertMessage = ({ type, message }) => {
  let icon;
  let alertClass = "";

  switch (type) {
    case "error":
      icon = <AiOutlineCloseCircle className={styles.iconError} />;
      alertClass = styles.error;
      break;

    case "success":
      icon = <AiOutlineCheckCircle className={styles.iconSuccess} />;
      alertClass = styles.success;
      break;

    case "loading":
      icon = <AiOutlineLoading3Quarters className={styles.iconLoading} />;
      alertClass = styles.loading;
      break;

    default:
      icon = null;
      alertClass = "";
  }

  return (
    <div className={`${styles.alert} ${alertClass}`}>
      {icon}
      <span className={styles.message}>{message}</span>
    </div>
  );
};

export default AlertMessage;
