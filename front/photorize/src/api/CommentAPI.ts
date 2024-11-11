import axios from "./axiosConfig";

export const createComment = async (memoryId: number, content: string) => {
  try {
    const response = await axios.post("/comments", {
      memoryId,
      content,
    });

    if (response.status === 201) {
      console.log(response.data);
      return response.data.data;
    }
  } catch (error) {
    console.error("앨범 생성 중 오류 발생:", error);
    throw error;
  }
};
