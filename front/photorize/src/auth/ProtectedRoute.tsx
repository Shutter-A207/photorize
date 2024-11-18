// ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("photorize-token"); // 기존 토큰 확인

  if (!token) {
    const tempToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("access_token"))
      ?.split("=")[1];

    if (tempToken) {
      localStorage.setItem("photorize-token", tempToken); // 토큰 저장
      return children; // 보호된 페이지 렌더링
    } else {
      return <Navigate to="/login" replace />; // 로그인 페이지로 리다이렉트
    }
  }

  return children; // 기존 토큰이 있을 경우 페이지 렌더링
};

export default ProtectedRoute;
