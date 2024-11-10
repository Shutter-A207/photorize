import axios from "./axiosConfig";

export const fetchReviews = async (pageNumber:Number, memoryId: number) => {
    try {
      const response = await axios.get(`/memories/${memoryId}`, {
        params: { pageNumber },
      });
  
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.error("리뷰 조회 중 오류 발생:", error);
      throw error;
    }
  };