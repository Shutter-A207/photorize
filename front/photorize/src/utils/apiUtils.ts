import axios from "../api/axiosConfig";

export const apiRequest = async (
    method: "get" | "post" | "put" | "delete",
    url: string,
    data?: object | FormData | null,
    params?: object | null,
    headers?: object // headers 추가
  ) => {
    try {
      const response = await axios({
        method,
        url,
        data,
        params,
        headers,
      });
  
      return response.data;
    } catch (error) {
      console.error(`API 요청 실패: ${url}`, error);
      throw error;
    }
  };
  