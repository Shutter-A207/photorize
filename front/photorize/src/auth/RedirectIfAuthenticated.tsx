// RedirectIfAuthenticated.js
import React from "react";
import { Navigate } from "react-router-dom";

const RedirectIfAuthenticated = ({ children }) => {
  const token = localStorage.getItem("photorize-token");

  // 로그인된 상태에서 로그인 페이지로 이동하려고 하면 홈으로 리다이렉트
  if (token) {
    return <Navigate to="/home" replace />;
  }

  return children; // 로그인되지 않은 경우 로그인 페이지로 접근 허용
};

export default RedirectIfAuthenticated;
