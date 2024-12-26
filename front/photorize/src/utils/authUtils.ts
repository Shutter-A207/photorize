// src/utils/authUtils.ts
export const getAuthToken = (): string | null => {
    // 로컬 스토리지에서 토큰 가져오기
    const token = localStorage.getItem("photorize-token");
  
    if (token) return token;
  
    // 쿠키에서 임시 토큰 가져오기
    const tempToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("access_token"))
      ?.split("=")[1];
  
    if (tempToken) {
      localStorage.setItem("photorize-token", tempToken);
      return tempToken;
    }
  
    return null;
  };
  
  export const isAuthenticated = (): boolean => {
    return !!getAuthToken();
  };
  