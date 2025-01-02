// pages/Album/useAlbum.ts
import { useState } from "react";
import { fetchAllAlbums } from "../../api/AlbumAPI";
import { useToast } from "../../components/Common/ToastProvider";
import { useLoading } from "../../components/Common/Loader/LoadingContext";

export interface AlbumData {
  albumId: number;
  name: string;
  type: string;
  colorId: number;
  colorCode: string;
}

export function useAlbum() {
  const [albums, setAlbums] = useState<AlbumData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { showToast } = useToast();
  const { setIsLoading } = useLoading();

  const loadAlbums = async () => {
    setIsLoading(true);
    try {
      const response = await fetchAllAlbums();
      if (response && response.status === 200) {
        setAlbums(response.data);
      }
    } catch (error) {
      console.error("앨범 목록을 가져오는 중 오류가 발생했습니다.", error);
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // 앨범 모달에서 성공 이벤트
  const handleModalSuccess = () => {
    showToast("앨범 생성에 성공했습니다!", "success");
    setIsModalOpen(false);
    loadAlbums();
  };

  return {
    albums,
    loadAlbums,
    isModalOpen,
    openModal,
    closeModal,
    handleModalSuccess,
  };
}
