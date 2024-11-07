import axios from "./axiosConfig";

export const fetchSpotsWithinBoundary = async (
  topLeftLat: number,
  topLeftLng: number,
  botRightLat: number,
  botRightLng: number
) => {
  try {
    const response = await axios.get("/spots/boundary", {
      params: {
        topLeftLat: topLeftLat,
        topLeftLng: topLeftLng,
        botRightLat: botRightLat,
        botRightLng: botRightLng,
      },
    });
    return response.data;
  } catch (error) {
    console.error("지점 조회 중 오류 발생:", error);
    throw error;
  }
};

export const fetchSpotMemories = async (spotId: number) => {
  try {
    const response = await axios.get(`/spots/${spotId}/memories`);
    return response.data;
  } catch (error) {
    console.error("추억 조회 중 오류 발생:", error);
    throw error;
  }
};
