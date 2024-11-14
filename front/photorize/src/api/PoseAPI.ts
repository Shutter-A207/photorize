import axios from "./axiosConfig";

export const getAllPoses = async (page: number, headcount: string) => {
  try {
    const response = await axios.get("/poses", {
      params: {
        pageNumber: page,
        headcount: headcount || undefined, // headcount가 없으면 파라미터 생략
      },
    });
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("포즈 전체 조회 중 오류 발생:", error);
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
