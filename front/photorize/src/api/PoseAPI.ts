import { apiRequest } from "../utils/apiUtils";

export const getAllPoses = (page: number, headcount?: string) =>
  apiRequest("get", "/poses", null, {
    pageNumber: page,
    headcount: headcount || undefined,
  });

export const likePose = (poseId: number) =>
  apiRequest("post", `/poses/${poseId}/like`);

export const unlikePose = (poseId: number) =>
  apiRequest("delete", `/poses/${poseId}/like`);
