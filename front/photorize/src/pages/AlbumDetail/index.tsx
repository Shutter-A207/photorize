// pages/AlbumDetail/index.tsx
import React from "react";
import Header from "../../components/Common/Header";
import Footer from "../../components/Common/Footer";
import ConfirmationModal from "../../components/Common/ConfirmationModal";

// 커스텀 훅, 컴포넌트 임포트
import { useAlbumDetail } from "./useAlbumDetail";
import MemberList from "./MemberList";
import MemoryGrid from "./MemoryGrid";

const AlbumDetail: React.FC = () => {
  const {
    albumDetail,
    lastMemoryElementRef,
    handleImageClick,
    handleMemberClick,
    showModal,
    selectedMember,
    confirmResend,
    closeModal,
  } = useAlbumDetail();

  // 데이터가 아직 없으면 로딩
  if (!albumDetail) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-[#F9F9F9] min-h-screen pt-14 pb-20">
      <Header title={albumDetail.name} />

      <div className="p-4">
        {/* 멤버 목록 (가로 스크롤) */}
        <MemberList members={albumDetail.members} onMemberClick={handleMemberClick} />

        {/* 메모리 그리드 (무한 스크롤) */}
        <MemoryGrid
          memories={albumDetail.memories}
          onImageClick={handleImageClick}
          lastMemoryElementRef={lastMemoryElementRef}
        />
      </div>

      <Footer />

      {/* 재전송 확인 모달 */}
      {showModal && selectedMember && (
        <ConfirmationModal
          message={`${selectedMember.nickname}님에게 알람을 재전송하시겠습니까?`}
          onConfirm={confirmResend}
          onCancel={closeModal}
        />
      )}
    </div>
  );
};

export default AlbumDetail;
