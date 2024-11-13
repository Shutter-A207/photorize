import axios from "./axiosConfig";

export const getAllPoses = async () => {
  try {
    const response = await axios.get("/poses");
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("포즈 전체조회 중 오류 발생:", error);
    throw error;
  }
};

export const likePose = async (poseId: number) => {
  try {
    const response = await axios.post(`/poses/${poseId}/like`);
    return response.data;
  } catch (error) {
    console.error(`포즈 ${poseId} 좋아요 중 오류 발생:`, error);
    throw error;
  }
};

export const unlikePose = async (poseId: number) => {
  try {
    const response = await axios.delete(`/poses/${poseId}/like`);
    return response.data;
  } catch (error) {
    console.error(`포즈 ${poseId} 좋아요 취소 중 오류 발생:`, error);
    throw error;
  }
};
