import { apiRequest } from "../utils/apiUtils";

export const createComment = (memoryId: number, content: string) =>
  apiRequest("post", "/comments", { memoryId, content });

export const deleteComment = (commentId: number) =>
  apiRequest("delete", `/comments/${commentId}`);
