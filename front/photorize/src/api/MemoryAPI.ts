import axios from "./axiosConfig";

export const fetchMemory = async (memoryId: number) => {
  try {
    const response = await axios.get(`/memories/${memoryId}`);

    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("추억 상세 조회 중 오류 발생:", error);
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