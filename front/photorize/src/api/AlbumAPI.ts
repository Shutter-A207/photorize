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

export const updateAlbum = async (
  albumId: number,
  name: string,
  colorId: number
) => {
  try {
    const response = await axios.post(`/albums/${albumId}`, {
      name,
      colorId,
    });

    if (response.status === 200 || response.status === 201) {
      return response.data || { status: 201 };
    }
  } catch (error) {
    console.error("앨범 수정 중 오류 발생:", error);
    throw error;
  }
};

export const fetchColors = async () => {
  try {
    const response = await axios.get("/albums/colors");

    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Album 전체 색상 조회 중 오류 발생:", error);
    throw error;
  }
};

export const searchAlbums = async (keyword: string) => {
  try {
    const response = await axios.get("/albums/search", {
      params: { keyword },
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("앨범 상세 조회 중 오류 발생:", error);
    throw error;
  }
};

export const createAlbum = async (
  name: string,
  colorId: number,
  members: number[]
) => {
  try {
    const response = await axios.post("/albums", {
      name,
      colorId,
      members,
    });

    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("앨범 생성 중 오류 발생:", error);
    throw error;
  }
};
