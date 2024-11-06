import axios from "./axiosConfig";

interface CreateMemoryData {
  date: string;
  spotId: number;
  content: string;
  albumIds: number[];
  type: "PRIVATE" | "PUBLIC";
  photo: File;
  video: File;
}

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
    throw error
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

export const fetchSpots = async () => {
  try {
    const response = await axios.get("/spots/all");

    if (response.status === 200) {
      return response.data;
      console.log(response.data);
    }
  } catch (error) {
    console.error("Spot 전체 조회 중 오류 발생:", error);
    throw error;
  }
};

export const sendMemoryData = async (data: CreateMemoryData) => {
  const formData = new FormData();

  formData.append("date", data.date);
  formData.append("spotId", data.spotId.toString());
  formData.append("content", data.content);
  data.albumIds.forEach((id) => formData.append("albumIds[]", id.toString()));
  formData.append("type", data.type);
  formData.append("photo", data.photo);
  formData.append("video", data.video);

  try {
    const response = await axios.post("/api/v1/memories", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("앨범 등록 성공:", response.data);
  } catch (error) {
    console.error("앨범 등록 중 오류 발생:", error);
    throw error;
  }
};
