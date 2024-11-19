import axios, { AxiosResponse } from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_SERVER_ENDPOINT;

const tokenExceptionRoutes = [
  "/login", // 예: 로그인 경로
  "/register", // 예: 회원가입 경로
];

axios.interceptors.request.use(
  (config) => {
    // 로컬 스토리지에서 토큰을 가져옴
    const token = localStorage.getItem("photorize-token");

    // 예외 경로가 아닌 경우에만 토큰 추가
    if (token && config.url && !tokenExceptionRoutes.includes(config.url)) {
      config.headers.Authorization = `Bearer ${token}`; // Authorization 헤더에 토큰 추가
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    console.error("API 호출 중 오류 발생:", error);
    if (error.response && error.response.status === 401) {
      console.warn("토큰 만료로 인한 로그아웃 처리");

      if (localStorage.getItem("photorize-token")) {
        localStorage.removeItem("photorize-token");
      }

      if (!tokenExceptionRoutes.includes(window.location.pathname)) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axios;
