import axios from "./axiosConfig";

export const fetchAlbums = async (pageNumber = 0) => {
  try {
    const response = await axios.get("/albums", {
      params: { pageNumber },
    });

    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Album 조회 중 오류 발생:", error);
    throw error;
  }
};

export const fetchAlbumDetails = async (albumId: number) => {
  try {
    const response = await axios.get(`/albums/${albumId}`);

    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("앨범 상세 조회 중 오류 발생:", error);
    throw error;
  }
};

export const deleteAlbum = async (albumId: number) => {
  try {
    await axios.delete(`/albums/${albumId}`);
  } catch (error) {
    console.error("Album 삭제 중 오류 발생:", error);
    throw error;
  }
};
