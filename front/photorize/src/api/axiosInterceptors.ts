import axios, { AxiosResponse } from "axios";
import { getToken, removeToken } from "../utils/tokenUtils";

// 예외적으로 토큰이 필요 없는 경로
const tokenExceptionRoutes = [
  "/login",
  "/register",
  ...(import.meta.env.VITE_TOKEN_EXCEPTION_ROUTES?.split(",") || []),
];

// 요청 인터셉터 설정
const addRequestInterceptor = () => {
  axios.interceptors.request.use(
    (config) => {
      const token = getToken();
      // 토큰이 존재하고, 예외 경로가 아닌 경우에만 Authorization 헤더 추가
      if (token && config.url && !tokenExceptionRoutes.includes(config.url)) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      console.error("요청 인터셉터 오류:", error);
      return Promise.reject(error);
    }
  );
};

// 응답 인터셉터 설정
const addResponseInterceptor = () => {
  axios.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error) => {
      console.error("API 호출 중 오류 발생:", error);

      if (error.response && error.response.status === 401) {
        console.warn("토큰 만료로 인해 로그아웃 처리 중...");

        // 토큰 제거
        removeToken();

        // 현재 경로가 예외 경로가 아니면 로그인 페이지로 리디렉션
        if (!tokenExceptionRoutes.includes(window.location.pathname)) {
          window.location.href = "/login";
        }
      }

      return Promise.reject(error);
    }
  );
};

// 인터셉터 초기화 함수
export const setupAxiosInterceptors = () => {
  addRequestInterceptor();
  addResponseInterceptor();
};
