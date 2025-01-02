import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAlbums, deleteAlbum } from "../../api/AlbumAPI";

export interface AlbumData {
  albumId: number;
  name: string;
  type: string;
  colorId: number;
  colorCode: string;
}

export function useAlbumEdit() {
  const [albums, setAlbums] = useState<AlbumData[]>([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [hasNext, setHasNext] = useState(true);

  // “앨범 삭제” 클릭 시 열리는 확인 모달 상태
  const [albumToDelete, setAlbumToDelete] = useState<number | null>(null);

  // “앨범 수정” 모달 상태
  const [selectedAlbum, setSelectedAlbum] = useState<AlbumData | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const navigate = useNavigate();

  // 앨범 목록 로드
  const loadAlbums = useCallback(async () => {
    if (!hasNext) return;
    try {
      const response = await fetchAlbums(pageNumber);
      if (response && response.status === 200) {
        setAlbums((prev) => [...prev, ...response.data.content]);
        setHasNext(response.data.hasNext);
      }
    } catch (error) {
      console.error("앨범 목록을 가져오는 중 오류가 발생했습니다:", error);
    }
  }, [pageNumber, hasNext]);

  useEffect(() => {
    loadAlbums();
  }, [pageNumber, loadAlbums]);

  // 무한 스크롤 관찰자
  const lastAlbumElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNext) {
          setPageNumber((prev) => prev + 1);
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [hasNext]
  );

  // 앨범 삭제
  const handleDeleteAlbum = async (albumId: number) => {
    try {
      await deleteAlbum(albumId);
      setAlbums((prev) => prev.filter((album) => album.albumId !== albumId));
      setAlbumToDelete(null);
    } catch (error) {
      console.error("앨범 삭제 중 오류 발생:", error);
    }
  };

  // 삭제 확인 모달 열기/닫기
  const openDeleteModal = (albumId: number) => {
    setAlbumToDelete(albumId);
  };
  const closeDeleteModal = () => {
    setAlbumToDelete(null);
  };

  // 수정 완료 → /album 페이지로 이동
  const handleCompleteEdit = () => {
    navigate("/album");
  };

  // 앨범 수정 모달 열기
  const handleEditAlbumClick = (album: AlbumData) => {
    setSelectedAlbum(album);
    setIsEditModalOpen(true);
  };
  // 앨범 수정 모달 닫기
  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  // 앨범 수정 API 완료 후, albums 상태 업데이트
  const updateEditedAlbum = (updatedAlbum: AlbumData) => {
    setAlbums((prev) =>
      prev.map((album) =>
        album.albumId === updatedAlbum.albumId ? updatedAlbum : album
      )
    );
  };

  return {
    albums,
    lastAlbumElementRef,
    albumToDelete,
    openDeleteModal,
    closeDeleteModal,
    handleDeleteAlbum,
    handleCompleteEdit,
    selectedAlbum,
    isEditModalOpen,
    handleEditAlbumClick,
    closeEditModal,
    updateEditedAlbum,
  };
}
