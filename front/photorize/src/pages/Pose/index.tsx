import React from "react";
import Header from "../../components/Common/Header";
import Footer from "../../components/Common/Footer";
import { usePose } from "./usePose";
import PoseFilterBar from "./PoseFilterBar";
import PoseGrid from "./PoseGrid";
import PoseModal from "./PoseModal";

const Pose: React.FC = () => {
  const {
    selectedPeople,
    showLikedOnly,
    filteredPoseData,
    isModalOpen,
    modalImage,
    handlePeopleSelect,
    handleToggleLiked,
    handleLikeToggle,
    openModal,
    closeModal,
  } = usePose();

  return (
    <>
      <Header title="포즈" />
      <div className="p-4 bg-[#F9F9F9] min-h-screen pt-[70px] pb-24">
        {/* 필터 영역 */}
        <PoseFilterBar
          selectedPeople={selectedPeople}
          onSelectPeople={handlePeopleSelect}
          showLikedOnly={showLikedOnly}
          onToggleLiked={handleToggleLiked}
        />

        {/* 포즈 목록 (좌/우 컬럼) */}
        <PoseGrid
          poseData={filteredPoseData}
          onImageClick={openModal}
          onLikeToggle={handleLikeToggle}
        />

        {/* 확대 모달 */}
        <PoseModal isOpen={isModalOpen} image={modalImage} onClose={closeModal} />
      </div>
      <Footer />
    </>
  );
};

export default Pose;
