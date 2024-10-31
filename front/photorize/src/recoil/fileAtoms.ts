import { atom } from "recoil";

export const photoState = atom<File | null>({
  key: "photoState",
  default: null,
});

export const videoState = atom<File | null>({
  key: "videoState",
  default: null,
});
