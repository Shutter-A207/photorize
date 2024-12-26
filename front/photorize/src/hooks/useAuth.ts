import { useEffect } from "react";
import { issueAndSaveFcmToken } from "../api/UserAPI";
import { getAuthToken } from "../utils/authUtils";

export const useAuth = (): boolean => {
  const token = getAuthToken();
  const fcmToken = localStorage.getItem("fcmToken");

  useEffect(() => {
    if (token && !fcmToken) {
      issueAndSaveFcmToken(token);
    }
  }, [token, fcmToken]);

  return !!token; // 인증 상태 반환
};
