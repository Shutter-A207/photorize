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
    const token = localStorage.getItem("token");

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
    return Promise.reject(error);
  }
);

export default axios;
