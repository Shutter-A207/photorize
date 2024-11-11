import { atom } from "recoil";

export const userData = atom<{
  id: number | undefined;
  nickname: string | undefined;
  img: string | undefined;
}>({
  key: "userData",
  default: {
    id: undefined,
    nickname: undefined,
    img: undefined,
  },
});