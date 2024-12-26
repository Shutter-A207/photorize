import { apiRequest } from "../utils/apiUtils";

export const fetchSpotsWithinBoundary = (
  topLeftLat: number,
  topLeftLng: number,
  botRightLat: number,
  botRightLng: number
) =>
  apiRequest("get", "/spots/boundary", null, {
    topLeftLat,
    topLeftLng,
    botRightLat,
    botRightLng,
  });

export const fetchAllSpots = () => apiRequest("get", "/spots/all");

export const fetchSpotMemories = (spotId: number) =>
  apiRequest("get", `/spots/${spotId}/memories`);

export const fetchSpots = (keyword: string) =>
  apiRequest("get", "/spots/search", null, { keyword });
