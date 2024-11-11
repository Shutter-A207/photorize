import axios from "./axiosConfig";

export const fetchMemory = async (memoryId: number) => {
  try {
    const response = await axios.get(`/memories/${memoryId}`);
    console.log("응답 데이터:", response.data);
    if (response.status === 200) {
      return response.data.data;
    }
  } catch (error) {
    throw error;
  }
};

export const sendMemoryData = async (formData: FormData) => {
  try {
    const response = await axios.post("/memories", formData);
    console.log("추억 등록 성공:", response.data);
  } catch (error) {
    console.error("추억 등록 중 오류 발생:", error);
    throw error;
  }
};

export const fetchReviews = async (pageNumber:Number, memoryId: number) => {
  try {
    const response = await axios.get(`/memories/${memoryId}/comments`, {
      params: { pageNumber },
    });

    if (response.status === 200) {
      return response.data.data;
    }
  } catch (error) {
    console.error("리뷰 조회 중 오류 발생:", error);
    throw error;
  }
};