import React, { useContext } from "react";
import styles from "./Login.module.css";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import GoogleIcon from "@mui/icons-material/Google";
import { auth, provider } from "../../utils/firebase";
import { signInWithPopup } from "firebase/auth";
import { AuthContext } from "../../utils/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
import { useState } from "react";

const Login = () => {
  const { login, setLogin, userInfo, setUserInfo } = useContext(AuthContext);
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const reqUserData = {
        name: user.displayName,
        email: user.email,
        photoUrl: user.photoURL,
      };

      await axios
        .post("/api/user", reqUserData)
        .then((res) => {
          setUserInfo(res.data.user);
          localStorage.setItem("userInfo", JSON.stringify(res.data.user));
        })
        .catch((err) => console.log(err));

      setLogin(true);
      localStorage.setItem("isLogin", true);

      navigate("/dashboard");
    } catch (err) {
      setAlert({ type: "error", message: "Something went wrong..." });

      setTimeout(() => {
        setAlert(null);
      }, 3000);
      console.log(err);
    }
  };

  return (
    <div className={styles.login}>
      <div className={styles.loginCard}>
        <div className={styles.loginCardTitle}>
          <h1>Login</h1>
          <VpnKeyIcon />
        </div>
        <div className={styles.googleBtn} onClick={handleLogin}>
          <GoogleIcon sx={{ color: "red", fontSize: 20 }} />
          Sign in with Google
        </div>
      </div>
    </div>
  );
};

export default Login;
