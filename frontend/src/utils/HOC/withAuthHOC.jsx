import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";

const withAuthHOC = (WrappedComponent) => {
  return (props) => {
    const { setLogin } = useContext(AuthContext);
    const navigate = useNavigate();
    useEffect(() => {
      const isLogin = localStorage.getItem("isLogin");
      if (!isLogin) {
        setLogin(false);
        navigate("/");
        return;
      }
    }, [navigate]);
    return <WrappedComponent {...props} />;
  };
};

export default withAuthHOC;
