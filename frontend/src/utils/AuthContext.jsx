import { createContext, useState } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  let loginData = localStorage.getItem("isLogin");
  let useInfoData = localStorage.getItem("userInfo");
  const [login, setLogin] = useState(loginData ? loginData : false);
  const [userInfo, setUserInfo] = useState(
    useInfoData ? JSON.parse(useInfoData) : null,
  );

  return (
    <AuthContext.Provider value={{ login, setLogin, userInfo, setUserInfo }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
