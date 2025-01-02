import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Common/Header";
import Footer from "../../components/Common/Footer";
import CreateAlbumModal from "../../components/Album/CreateAlbumModal";
import { useToast } from "../../components/Common/ToastProvider";
import AlbumList from "./AlbumList";
import { useAlbumInfiniteScroll } from "./useAlbumInfiniteScroll";

const Album: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  // 무한 스크롤 훅 사용
  const { albums, lastAlbumElementRef, setAlbums } = useAlbumInfiniteScroll();

  // 모달
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEditClick = () => {
    navigate("/album/edit");
  };

  const handleModalSuccess = () => {
    showToast("앨범 생성에 성공했습니다!", "success");
    setIsModalOpen(false);
    // 새 앨범 생성 후 페이지 전체 리로드 대신,
    // 아래처럼 “처음부터 앨범 목록 다시 불러오기” 로직을 원하는 방식으로 처리해도 됨:
    window.location.reload();
  };

  return (
    <div className="bg-[#F9F9F9] min-h-screen pt-16 pb-20">
      <Header title="앨범 목록" />

      {/* 상단 버튼영역 */}
      <div className="flex justify-between items-center mt-2 px-6">
        <div className="space-x-2">
          <button
            onClick={() => setIsModalOpen(true)}
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
          src="/assets/carousel.png"
          alt="Moon Icon"
          className="w-12 h-12 cursor-pointer"
          onClick={() => navigate("/album")}
        />
      </div>

      {/* 앨범 리스트 (무한 스크롤) */}
      <AlbumList albums={albums} lastAlbumElementRef={lastAlbumElementRef} />

      <Footer />

      {/* 앨범 생성 모달 */}
      <CreateAlbumModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
};

export default Album;
