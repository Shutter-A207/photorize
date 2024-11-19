import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { issueAndSaveFcmToken } from "../api/UserAPI";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("photorize-token");
  const fcmToken = localStorage.getItem("fcmToken");

  useEffect(() => {
    if (!token) {
      // 쿠키에서 임시 토큰 확인
      const tempToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("access_token"))
        ?.split("=")[1];

      if (tempToken) {
        localStorage.setItem("photorize-token", tempToken);

        // FCM 토큰 발급
        if (!fcmToken) {
          issueAndSaveFcmToken(tempToken);
        }
      }
    } else {
      // 기존 토큰이 있는 경우 FCM 토큰 발급 확인
      if (!fcmToken) {
        issueAndSaveFcmToken(token);
      }
    }
  }, [token, fcmToken]);

  if (!token && !document.cookie.includes("access_token")) {
    return <Navigate to="/login" replace />; // 로그인 페이지로 리다이렉트
  }

  return <>{children}</>; // 보호된 페이지 렌더링
};

export default ProtectedRoute;
