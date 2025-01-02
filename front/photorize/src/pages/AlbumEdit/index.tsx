// pages/AlbumEdit/index.tsx
import React from "react";
import Header from "../../components/Common/Header";
import Footer from "../../components/Common/Footer";
import ConfirmationModal from "../../components/Common/ConfirmationModal";
import EditAlbumModal from "../../components/Album/EditAlbumModal";
import AlbumEditList from "./AlbumEditList";
import { useAlbumEdit } from "./useAlbumEdit";

const AlbumEdit: React.FC = () => {
  const {
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
  } = useAlbumEdit();

  return (
    <div className="bg-[#F9F9F9] min-h-screen pt-16 pb-20">
      <Header title="앨범 수정" />

      <div className="flex justify-between mt-2 mr-4 space-x-2">
        <div className="ml-6 mt-1 text-sm font-bold text-[#818181]">
          앨범을 눌러 이름과 색상을 수정, X를 눌러 앨범을 나갈 수 있어요
        </div>
        <button
          onClick={handleCompleteEdit}
          className="px-4 py-1 text-white rounded bg-[#8B8B8B] whitespace-nowrap"
        >
          완료
        </button>
      </div>

      {/* 앨범 리스트 */}
      <AlbumEditList
        albums={albums}
        lastAlbumElementRef={lastAlbumElementRef}
        onEditAlbumClick={handleEditAlbumClick}
        onDeleteButtonClick={openDeleteModal}
      />

      <Footer />

      {/* 앨범 삭제 확인 모달 */}
      {albumToDelete !== null && (
        <ConfirmationModal
          message="정말로 앨범을 삭제하시겠습니까?"
          onConfirm={() => handleDeleteAlbum(albumToDelete)}
          onCancel={closeDeleteModal}
        />
      )}

      {/* 앨범 수정 모달 */}
      {isEditModalOpen && selectedAlbum && (
        <EditAlbumModal
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          albumName={selectedAlbum.name}
          selectedColor={selectedAlbum.colorCode}
          albumId={selectedAlbum.albumId}
          albumType={selectedAlbum.type}
          onNameChange={(e) =>
            updateEditedAlbum({
              ...selectedAlbum,
              name: e.target.value,
            })
          }
          onSelectColor={(color) =>
            updateEditedAlbum({
              ...selectedAlbum,
              colorCode: color,
            })
          }
          onSuccess={(updatedAlbum) => {
            updateEditedAlbum(updatedAlbum);
            closeEditModal();
          }}
        />
      )}
    </div>
  );
};

export default AlbumEdit;
