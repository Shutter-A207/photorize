import React from "react";
import Header from "../../components/Common/Header";
import Footer from "../../components/Common/Footer";
import ConfirmationModal from "../../components/Common/ConfirmationModal";
import Spinner from "../../components/Common/Loader/Spinner";
import MemoryCarousel from "./MemoryCarousel";
import MemoryDetail from "./MemoryDetail";
import CommentList from "./CommentList";
import { useMemory } from "./useMemory";

const Memory: React.FC = () => {
  const {
    memoryDetail,
    carouselData,
    comments,
    newComment,
    commentToDelete,
    menuOpen,
    deleteMemoryModalOpen,
    deleteCommentModalOpen,
    error,
    isSpinning,
    currentIndex,
    handleAddComment,
    handleDeleteComment,
    handleDeleteMemory,
    toggleMenu,
    formatDate,
    lastCommentRef,
    setDeleteMemoryModalOpen,
    setDeleteCommentModalOpen,
    setCommentToDelete,
    setNewComment,
    handleScroll,
    nickname,
  } = useMemory();

  // 에러 처리
  if (error) {
    return (
      <div className="bg-[#F9F9F9] min-h-screen pt-14 pb-20 flex items-center justify-center">
        <p className="text-red-500 text-sm font-bold">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-[#F9F9F9] min-h-screen pt-14 pb-20">
      <Header title="추억" />

      <div className="p-4">
        {/* 캐러셀 */}
        <MemoryCarousel
          carouselData={carouselData}
          onScroll={handleScroll}
          currentIndex={currentIndex}
        />

        {/* 추억 상세 */}
        {memoryDetail && (
          <MemoryDetail
            memoryDetail={memoryDetail}
            menuOpen={menuOpen}
            toggleMenu={toggleMenu}
            onOpenDeleteModal={() => setDeleteMemoryModalOpen(true)}
            canManage={nickname === memoryDetail.nickname}
          />
        )}

        <div className="border-t border-gray-200 mt-6 mb-2"></div>

        {/* 댓글 작성 */}
        <div className="flex flex-col mt-4">
          <input
            type="text"
            placeholder="댓글 작성 (최대 100자)"
            value={newComment}
            onChange={(e) => {
              if (e.target.value.length <= 100) {
                setNewComment(e.target.value);
              }
            }}
            className="border border-[#FFD2D2] rounded-full pl-4 py-2 text-sm text-gray-500 focus:outline-none mb-2"
          />
          {/* 글자 수 표시 + 등록 버튼 */}
          <div className="flex items-center justify-end">
            <div
              className={`text-xs font-bold mr-2 ${
                newComment.length <= 0 || newComment.length > 100
                  ? "text-red-500"
                  : "text-gray-500"
              }`}
            >
              {newComment.length}/100
            </div>
            <button
              onClick={handleAddComment}
              className={`rounded-full px-4 py-2 text-white text-sm font-bold ${
                isSpinning ||
                newComment.trim().length < 1 ||
                newComment.length > 100
                  ? "bg-[#CCCCCC]"
                  : "bg-[#FF93A5]"
              }`}
              disabled={
                isSpinning ||
                newComment.trim().length < 1 ||
                newComment.length > 100
              }
            >
              {isSpinning ? <Spinner /> : "등록"}
            </button>
          </div>
        </div>

        {/* 댓글 목록 */}
        <CommentList
          comments={comments}
          nickname={nickname}
          lastCommentRef={lastCommentRef}
          formatDate={formatDate}
          onDeleteClick={(commentId) => {
            setCommentToDelete(commentId);
            setDeleteCommentModalOpen(true);
          }}
        />
      </div>

      {/* 추억 삭제 모달 */}
      {deleteMemoryModalOpen && (
        <ConfirmationModal
          message="정말로 이 추억을 삭제하시겠습니까?"
          onConfirm={handleDeleteMemory}
          onCancel={() => setDeleteMemoryModalOpen(false)}
        />
      )}

      {/* 댓글 삭제 모달 */}
      {deleteCommentModalOpen && (
        <ConfirmationModal
          message="정말로 이 댓글을 삭제하시겠습니까?"
          onConfirm={handleDeleteComment}
          onCancel={() => setDeleteCommentModalOpen(false)}
        />
      )}

      <Footer />
    </div>
  );
};

export default Memory;
