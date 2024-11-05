import React, { useState, useEffect } from "react";
import Header from "../../components/Common/Header";
import Footer from "../../components/Common/Footer";
import DatePicker from "../../components/Album/DatePicker";
import { DateValueType } from "react-tailwindcss-datepicker";
import SearchSpot from "../../components/Common/SearchSpot";
import MemoInput from "../../components/Album/MemoInput";
import MediaUploadSection from "../../components/Album/MediaUploadSection";
import ShareSelectionToggle from "../../components/Album/ShareSelectionToggle";
import CreateAlbumModal from "../../components/Album/CreateAlbumModal";
import SearchTag from "../../components/Common/SearchTag";
import SearchAlbum from "../../components/Common/SearchAlbum";

const Record: React.FC = () => {
  const [shareSelection, setShareSelection] = useState<string>("내 앨범");
  const [value, setValue] = useState<DateValueType>({
    startDate: null,
    endDate: null,
  });
  const [location, setLocation] = useState<string>("");
  const [memo, setMemo] = useState<string>("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [tags, setTag] = useState<string[]>([]);
  const [album, setAlbum] = useState<string>("");
  const [isButtonEnabled, setIsButtonEnabled] = useState<boolean>(false);
  const [isAlbumModalOpen, setIsAlbumModalOpen] = useState<boolean>(false);
  const [newAlbumName, setNewAlbumName] = useState<string>("");
  const [selectedAlbum, setSelectedAlbum] = useState<string>("개인");
  const [selectedColor, setSelectedColor] = useState<string>("");

  useEffect(() => {
    const hasDate = value?.startDate !== null;
    const hasLocation = location.trim() !== "";
    const hasMemo = memo.trim() !== "";
    const hasMediaContent = photos.length > 0 || videos.length > 0;
    const hasRequiredTag =
      shareSelection === "내 앨범" ||
      (shareSelection === "공유" && (tags.length > 0 || album !== ""));

    setIsButtonEnabled(
      hasDate && hasLocation && hasMemo && hasMediaContent && hasRequiredTag
    );
  }, [value, location, memo, photos, videos, tags, album, shareSelection]);

  return (
    <>
      <Header title="추억 기록" />
      <div className="bg-[#F9F9F9] min-h-screen pt-20 pb-20 pl-6 pr-6 flex flex-col items-center">
        <DatePicker value={value} onChange={(newValue) => setValue(newValue)} />
        <SearchSpot
          imageSrc="/assets/map-icon.png"
          placeholder="장소"
          onChange={setLocation}
        />
        <MemoInput
          memo={memo}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setMemo(e.target.value)
          }
        />
        <MediaUploadSection
          onPhotoUpload={setPhotos}
          onVideoUpload={setVideos}
        />
        <ShareSelectionToggle
          shareSelection={shareSelection}
          onToggle={setShareSelection}
        />

        {shareSelection === "공유" && (
          <>
            <div className="flex justify-between w-full max-w-md">
              <select
                value={selectedAlbum}
                onChange={(e) => setSelectedAlbum(e.target.value)}
                className="bg-white border border-[#B3B3B3] rounded-lg p-2 mb-2 text-sm text-[#343434] outline-none"
              >
                <option value="personal">개인</option>
                <option value="album">앨범</option>
              </select>
              {selectedAlbum === "album" && (
                <button
                  onClick={() => setIsAlbumModalOpen(true)}
                  className="text-[#818181] mb-2 text-sm font-medium underline"
                >
                  새 앨범 만들기
                </button>
              )}
            </div>
            {selectedAlbum === "personal" ? (
              <SearchTag
                imageSrc="/assets/tag-icon.png"
                placeholder="태그"
                onChange={setTag}
              />
            ) : (
              <SearchAlbum
                imageSrc="/assets/tag-icon.png"
                placeholder="태그"
                onChange={setAlbum}
              />
            )}
          </>
        )}

        <div className="flex items-center justify-end w-full max-w-md mt-4">
          {!isButtonEnabled && (
            <p className="text-sm text-[#FF4D4F] mr-4">
              모든 필드를 입력해 주세요.
            </p>
          )}
          <button
            className={`text-white text-sm font-medium py-2 px-4 rounded-full ${
              isButtonEnabled
                ? "bg-[#FF93A5] cursor-pointer"
                : "bg-[#CCCCCC] cursor-not-allowed"
            }`}
            disabled={!isButtonEnabled}
          >
            등록
          </button>
        </div>

        <CreateAlbumModal
          isOpen={isAlbumModalOpen}
          onClose={() => {
            setSelectedAlbum("album");
            setIsAlbumModalOpen(false);
          }}
          albumName={newAlbumName}
          onNameChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setNewAlbumName(e.target.value)
          }
          onCreate={() => {
            setAlbum(newAlbumName);
            setSelectedAlbum("album");
            setIsAlbumModalOpen(false);
            setNewAlbumName("");
          }}
          selectedColor={selectedColor}
          onSelectColor={setSelectedColor}
          onTagChange={setTag}
          tags={tags}
        />
      </div>
      <Footer />
    </>
  );
};

export default Record;
