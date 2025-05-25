import React from "react";
import { createContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(localStorage.getItem("token"));

  const login = (token) => {
    localStorage.setItem("token", token);
    setUserToken(token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUserToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ userToken, isLoggedIn: !!userToken, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
