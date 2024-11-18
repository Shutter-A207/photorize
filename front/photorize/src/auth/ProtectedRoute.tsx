import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { issueAndSaveFcmToken } from "../api/UserAPI";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("photorize-token");

  useEffect(() => {
    // 토큰이 있을 경우 FCM 토큰 확인 및 발급
    if (token) {
      const fcmToken = localStorage.getItem("fcmToken");
      if (!fcmToken) {
        issueAndSaveFcmToken(token);
      }
    }
  }, [token]);

  if (!token) {
    // 쿠키에서 임시 토큰 확인
    const tempToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("access_token"))
      ?.split("=")[1];

    if (tempToken) {
      localStorage.setItem("photorize-token", tempToken);

      // FCM 토큰 발급
      issueAndSaveFcmToken(tempToken);

      return children; // 보호된 페이지 렌더링
    } else {
      return <Navigate to="/login" replace />; // 로그인 페이지로 리다이렉트
    }
  }

  return children; // 기존 토큰이 있을 경우 페이지 렌더링
};

export default ProtectedRoute;
