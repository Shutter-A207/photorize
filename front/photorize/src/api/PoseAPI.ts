import axios from "./axiosConfig";

export const getAllPoses = async (
  page: number,
  headcount: string | undefined
) => {
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
  const response = await axios.post(`/poses/${poseId}/like`);
  return response.data;
};

export const unlikePose = async (poseId: number) => {
  const response = await axios.delete(`/poses/${poseId}/like`);
  return response.data;
};
