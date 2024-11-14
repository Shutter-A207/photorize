import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Common/Header";
import Footer from "../../components/Common/Footer";
import AlbumItem from "../../components/Common/AlbumItem";
import { fetchAlbums, deleteAlbum } from "../../api/AlbumAPI";
import ConfirmationModal from "../../components/Common/ConfirmationModal"; // import the modal
import EditAlbumModal from "../../components/Album/EditAlbumModal";

interface AlbumData {
  albumId: number;
  name: string;
  type: string;
  colorId: number;
  colorCode: string;
}

const AlbumEdit = () => {
  const [albums, setAlbums] = useState<AlbumData[]>([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [hasNext, setHasNext] = useState(true);
  const [albumToDelete, setAlbumToDelete] = useState<number | null>(null); // Track album to delete
  const [selectedAlbum, setSelectedAlbum] = useState<AlbumData | null>(null); // 수정할 앨범
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const navigate = useNavigate();

  const loadAlbums = useCallback(async () => {
    if (hasNext) {
      try {
        const response = await fetchAlbums(pageNumber);
        if (response && response.status === 200) {
          setAlbums((prevAlbums) => [...prevAlbums, ...response.data.content]);
          setHasNext(response.data.hasNext);
        }
      } catch (error) {
        console.error("앨범 목록을 가져오는 중 오류가 발생했습니다.", error);
      }
    }
  }, [pageNumber, hasNext]);

  useEffect(() => {
    loadAlbums();
  }, [pageNumber, loadAlbums]);

  const lastAlbumElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNext) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) observerRef.current.observe(node);
    },
    [hasNext]
  );

  const handleDeleteAlbum = async (albumId: number) => {
    try {
      await deleteAlbum(albumId);
      setAlbums((prevAlbums) =>
        prevAlbums.filter((album) => album.albumId !== albumId)
      );
      setAlbumToDelete(null); // Close the modal after deletion
    } catch (error) {
      console.error("앨범 삭제 중 오류 발생:", error);
    }
  };

  const handleCompleteEdit = () => {
    navigate("/album");
  };

  const handleEditAlbumClick = (album: AlbumData) => {
    setSelectedAlbum(album);
    setIsEditModalOpen(true);
  };

  return (
    <div className="bg-[#F9F9F9] min-h-screen pt-16 pb-20">
      <Header title="앨범 수정" />
      <div className="flex justify-between mt-2 mr-4 space-x-2">
        <div className="ml-6 mt-1 text-sm font-bold text-[#818181]">
          앨범을 눌러 이름과 색상을 수정, X를 눌러 앨범을 나갈 수 있어요
        </div>
        <button
          onClick={handleCompleteEdit}
          className="px-4 py-1 text-white rounded bg-[#8B8B8B]"
        >
          완료
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3 p-4">
        {albums.map((album, index) => (
          <div
            key={album.albumId}
            className="relative"
            onClick={() => handleEditAlbumClick(album)}
          >
            <AlbumItem
              id={album.albumId}
              name={album.name}
              color={album.colorCode}
              isEditable={false}
              ref={index === albums.length - 1 ? lastAlbumElementRef : null}
            />
            {album.type !== "PRIVATE" && ( // type이 private이 아닌 경우에만 삭제 버튼 렌더링
              <button
                onClick={(event) => {
                  event.stopPropagation(); // 이벤트 전파 방지
                  setAlbumToDelete(album.albumId); // 삭제 확인 모달 열기
                }}
                className="absolute top-1 right-2 rounded-full w-6 h-6 flex items-center justify-center"
              >
                <img
                  src="/assets/remove-icon.png"
                  alt="Remove icon"
                  className="w-5 h-5"
                />
              </button>
            )}
          </div>
        ))}
      </div>
      <Footer />
      {albumToDelete !== null && (
        <ConfirmationModal
          message="정말로 앨범을 삭제하시겠습니까?"
          onConfirm={() => handleDeleteAlbum(albumToDelete)}
          onCancel={() => setAlbumToDelete(null)} // Close modal on cancel
        />
      )}

      {/* 앨범 수정 모달 */}
      {isEditModalOpen && selectedAlbum && (
        <EditAlbumModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          albumName={selectedAlbum.name}
          selectedColor={selectedAlbum.colorCode}
          albumId={selectedAlbum.albumId}
          albumType={selectedAlbum.type}
          onNameChange={(e) =>
            setSelectedAlbum({ ...selectedAlbum, name: e.target.value })
          }
          onSelectColor={(color) =>
            setSelectedAlbum({ ...selectedAlbum, colorCode: color })
          }
          onSuccess={(updatedAlbum) => {
            // albums 상태에서 수정된 앨범만 업데이트
            setAlbums((prevAlbums) =>
              prevAlbums.map((album) =>
                album.albumId === updatedAlbum.albumId ? updatedAlbum : album
              )
            );
            setIsEditModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default AlbumEdit;
