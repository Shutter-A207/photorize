// pages/Record/index.tsx
import React from "react";
import Header from "../../components/Common/Header";
import Footer from "../../components/Common/Footer";
import CreateAlbumModal from "../../components/Album/CreateAlbumModal";
import RecordForm from "./RecordForm";
import { useRecord } from "./useRecord";

const Record: React.FC = () => {
  const {
    shareSelection,
    setShareSelection,
    date,
    setDate,
    spot,
    setSpot,
    memo,
    setMemo,
    photo,
    setPhoto,
    video,
    setVideo,
    tags,
    setTags,
    album,
    setAlbum,
    selectedAlbum,
    setSelectedAlbum,
    isAlbumModalOpen,
    setIsAlbumModalOpen,
    isButtonEnabled,
    isLoading,
    handleModalSuccess,
    handleRegister,
  } = useRecord();

  return (
    <>
      <Header title="추억 기록" />

      <RecordForm
        shareSelection={shareSelection}
        setShareSelection={setShareSelection}
        date={date}
        setDate={setDate}
        spot={spot}
        setSpot={setSpot}
        memo={memo}
        setMemo={setMemo}
        photo={photo}
        setPhoto={setPhoto}
        video={video}
        setVideo={setVideo}
        tags={tags}
        setTags={setTags}
        album={album}
        setAlbum={setAlbum}
        selectedAlbum={selectedAlbum}
        setSelectedAlbum={setSelectedAlbum}
        isAlbumModalOpen={isAlbumModalOpen}
        onOpenAlbumModal={() => setIsAlbumModalOpen(true)}
        isButtonEnabled={isButtonEnabled}
        isLoading={isLoading}
        handleRegister={handleRegister}
      />

      <CreateAlbumModal
        isOpen={isAlbumModalOpen}
        onClose={() => setIsAlbumModalOpen(false)}
        onSuccess={handleModalSuccess}
      />

      <Footer />
    </>
  );
};

export default Record;
