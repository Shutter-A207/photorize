import { apiRequest } from "../utils/apiUtils";

export const fetchMemory = (memoryId: number) =>
  apiRequest("get", `/memories/${memoryId}`);

export const sendMemoryData = (formData: FormData) =>
  apiRequest("post", "/memories", formData);

export const fetchReviews = (pageNumber: number, memoryId: number) =>
  apiRequest("get", `/memories/${memoryId}/comments`, null, { pageNumber });

export const deleteMemory = (memoryId: number) =>
  apiRequest("delete", `/memories/${memoryId}`);

export const fetchMainPageMemories = () =>
  apiRequest("get", "/memories/mainpage");
