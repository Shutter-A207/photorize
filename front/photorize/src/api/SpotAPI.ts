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

export const fetchAllSpots = async () => {
  try {
    const response = await axios.get("/spots/all");

    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Spot 전체 조회 중 오류 발생:", error);
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

export const fetchSpots = async (keyword: string) => {
  try {
    const response = await axios.get("/spots/search", {
      params: { keyword },
    });

    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Spot 검색 조회 중 오류 발생:", error);
    throw error;
  }
};
