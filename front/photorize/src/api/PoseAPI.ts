import axios from "./axiosConfig";

export const getAllPoses = async () => {
  const response = await axios.get("/poses");
  return response.data;
};

export const likePose = async (poseId: number) => {
  const response = await axios.post(`/poses/${poseId}/like`);
  return response.data;
};

export const unlikePose = async (poseId: number) => {
  const response = await axios.delete(`/poses/${poseId}/like`);
  return response.data;
};
