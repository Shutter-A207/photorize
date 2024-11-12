import axios from "./axiosConfig";

export const fetchMemory = async (memoryId: number) => {
  try {
    const response = await axios.get(`/memories/${memoryId}`);
    console.log("응답 데이터:", response.data);
    if (response.status === 200) {
      return response.data.data;
    }
  } catch (error) {
    console.error("추억 조회 중 오류 발생:", error);
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

export const fetchReviews = async (pageNumber: number, memoryId: number) => {
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

export const deleteMemory = async (memoryId: number): Promise<void> => {
  try {
    await axios.delete(`/memories/${memoryId}`);
  } catch (error) {
    console.error("추억 삭제 중 오류 발생: ", error);
  }
};

export const fetchMainPageMemories = async () => {
  try {
    const response = await axios.get("/memories/mainpage");
    console.log(response);
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("메인 페이지 앨범 조회 중 오류 발생:", error);
    throw error;
  }
};
