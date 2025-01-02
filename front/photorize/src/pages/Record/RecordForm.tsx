import React from "react";
import DatePicker from "../../components/Album/DatePicker";
import { DateValueType } from "react-tailwindcss-datepicker";
import SearchSpot from "../../components/Common/SearchSpot";
import MemoInput from "../../components/Album/MemoInput";
import MediaUploadSection from "../../components/Album/MediaUploadSection";
import ShareSelectionToggle from "../../components/Album/ShareSelectionToggle";
import SearchTag from "../../components/Common/SearchTag";
import SearchAlbum from "../../components/Common/SearchAlbum";
import Spinner from "../../components/Common/Loader/Spinner";
import { Album, User } from "./useRecord";

interface RecordFormProps {
  shareSelection: string;
  setShareSelection: (val: string) => void;

  date: DateValueType;
  setDate: (val: DateValueType) => void;

  spot: { id: number | null; name: string | null };
  setSpot: (val: { id: number | null; name: string | null }) => void;

  memo: string;
  setMemo: (val: string) => void;

  photo: File | null;
  setPhoto: (file: File | null) => void;
  video: File | null;
  setVideo: (file: File | null) => void;

  // 공유 관련
  tags: User[];
  setTags: (val: User[]) => void;
  album: Album | null;
  setAlbum: (val: Album | null) => void;
  selectedAlbum: string;
  setSelectedAlbum: (val: string) => void;

  isAlbumModalOpen: boolean;
  onOpenAlbumModal: () => void;

  isButtonEnabled: boolean;
  isLoading: boolean;
  handleRegister: () => void;
}

const RecordForm: React.FC<RecordFormProps> = ({
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
  onOpenAlbumModal,
  isButtonEnabled,
  isLoading,
  handleRegister,
}) => {
  return (
    <div className="bg-[#F9F9F9] min-h-screen pt-20 pb-20 pl-6 pr-6 flex flex-col items-center">
      <DatePicker value={date} onChange={(newValue) => setDate(newValue)} />

      <div className="md:ml-4 mb-4 w-full">
        <SearchSpot
          imageSrc="/assets/map-icon.png"
          placeholder="네컷 스팟"
          onChange={setSpot}
          selectedSpot={spot}
        />
      </div>

      <MemoInput
        memo={memo}
        onChange={(e) => setMemo(e.target.value)}
      />

      <MediaUploadSection
        onPhotoUpload={setPhoto}
        onVideoUpload={setVideo}
      />

      <ShareSelectionToggle
        shareSelection={shareSelection}
        onToggle={setShareSelection}
      />

      {shareSelection === "공유" && (
        <>
          <div className="flex justify-between w-full max-w-md">
            <div className="flex items-center mb-2">
              <select
                value={selectedAlbum}
                onChange={(e) => setSelectedAlbum(e.target.value)}
                className="bg-white border border-[#B3B3B3] rounded-lg p-2 text-sm text-[#343434] outline-none"
              >
                <option value="personal">개인</option>
                <option value="album">앨범</option>
              </select>
              <div className="text-xs text-[#818181] ml-2">
                {selectedAlbum === "personal"
                  ? "각자의 개인 앨범에 저장됩니다"
                  : "선택한 공유 앨범에 저장됩니다"}
              </div>
            </div>

            {selectedAlbum === "album" && (
              <button
                onClick={onOpenAlbumModal}
                className="text-[#818181] mb-2 text-sm font-medium underline"
              >
                새 앨범 만들기
              </button>
            )}
          </div>

          <div className="md:ml-4 mb-4 w-full">
            {selectedAlbum === "personal" ? (
              <SearchTag
                imageSrc="/assets/tag-icon.png"
                placeholder="태그"
                onChange={setTags}
              />
            ) : (
              <SearchAlbum
                imageSrc="/assets/album-icon-active.png"
                placeholder="공유 앨범"
                onChange={setAlbum}
                selectedAlbum={album}
              />
            )}
          </div>
        </>
      )}

      <div className="flex items-center justify-end w-full max-w-md mt-4">
        {!isButtonEnabled && (
          <p className="text-sm text-[#FF4D4F] mr-4">모든 값을 입력해 주세요</p>
        )}
        <button
          className={`text-white text-sm font-medium py-2 px-4 rounded-full ${
            isButtonEnabled && !isLoading
              ? "bg-[#FF93A5] cursor-pointer"
              : "bg-[#CCCCCC] cursor-not-allowed"
          }`}
          disabled={!isButtonEnabled || isLoading}
          onClick={handleRegister}
        >
          {isLoading ? <Spinner /> : "등록"}
        </button>
      </div>
    </div>
  );
};

export default RecordForm;
