// pages/Album/index.tsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Common/Header";
import Footer from "../../components/Common/Footer";
import CreateAlbumModal from "../../components/Album/CreateAlbumModal";
import AlbumCarousel from "./AlbumCarousel";
import { useAlbum } from "./useAlbum";

const Album: React.FC = () => {
  const {
    albums,
    loadAlbums,
    isModalOpen,
    openModal,
    closeModal,
    handleModalSuccess,
  } = useAlbum();

  const navigate = useNavigate();

  // 컴포넌트 마운트 시 앨범 목록 로드
  useEffect(() => {
    loadAlbums();
  }, [loadAlbums]);

  // 편집 페이지 이동
  const handleEditClick = () => {
    navigate("/album/edit");
  };

  // 앨범2 페이지 예시
  const handleSquaresClick = () => {
    navigate("/album2");
  };

  return (
    <div className="bg-[#F9F9F9] min-h-screen pt-16 pb-20 overflow-hidden">
      <Header title="앨범 목록" />

      {/* 상단 버튼 영역 */}
      <div className="flex justify-between items-center mt-2 px-6">
        <div className="space-x-2">
          <button
            onClick={openModal}
            className="px-4 py-1 text-white rounded bg-[#FF93A5]"
          >
            추가
          </button>
          <button
            onClick={handleEditClick}
            className="px-4 py-1 text-white rounded bg-[#8B8B8B]"
          >
            편집
          </button>
        </div>
        <img
          src="/assets/squares.png"
          alt="Squares Icon"
          className="w-12 h-12 cursor-pointer"
          onClick={handleSquaresClick}
        />
      </div>

      {/* 앨범 캐러셀 */}
      <AlbumCarousel albums={albums} />

      <Footer />

      {/* 앨범 생성 모달 */}
      <CreateAlbumModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
};

export default Album;
