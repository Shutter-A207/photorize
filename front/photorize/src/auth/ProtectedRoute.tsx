// ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("photorize-token"); // 토큰을 통해 로그인 상태 확인

  // 토큰이 없으면 로그인 페이지로 리다이렉트
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children; // 토큰이 있으면 원래 페이지를 렌더링
};

export default ProtectedRoute;
