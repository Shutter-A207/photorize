import { apiRequest } from "../utils/apiUtils";

export const fetchAlbums = (pageNumber = 0) =>
  apiRequest("get", "/albums", null, { pageNumber });

export const fetchAllAlbums = () => apiRequest("get", "/albums/all");

export const fetchAlbumDetails = (albumId: number, pageNumber: number) =>
  apiRequest("get", `/albums/${albumId}`, null, { pageNumber });

export const deleteAlbum = (albumId: number) =>
  apiRequest("delete", `/albums/${albumId}`);

export const updateAlbum = (
  albumId: number,
  name: string,
  colorId: number
) => apiRequest("post", `/albums/${albumId}`, { name, colorId });

export const fetchColors = () => apiRequest("get", "/albums/colors");

export const searchAlbums = (keyword: string) =>
  apiRequest("get", "/albums/search", null, { keyword });

export const createAlbum = (
  name: string,
  colorId: number,
  members: number[]
) => apiRequest("post", "/albums", { name, colorId, members });
