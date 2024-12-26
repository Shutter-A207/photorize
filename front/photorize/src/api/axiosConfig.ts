import axios from "axios";
import { setupAxiosInterceptors } from "./axiosInterceptors";

axios.defaults.withCredentials = true;
axios.defaults.baseURL =
  import.meta.env.VITE_SERVER_ENDPOINT || "https://default-server-url.com";

setupAxiosInterceptors();

export default axios;