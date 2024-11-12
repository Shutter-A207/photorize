import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { sendMemoryData } from "../../api/MemoryAPI";

interface Spot {
  id: number | null;
  name: string | null;
}

interface User {
  id: number;
  name: string;
  privateAlbumId: number;
}

interface Album {
  id: number | null;
  name: string | null;
  members: string[] | null;
}

const Record: React.FC = () => {
  const [shareSelection, setShareSelection] = useState<string>("내 앨범");
  const [date, setDate] = useState<DateValueType>({
    startDate: null,
    endDate: null,
  });
  const [spot, setSpot] = useState<Spot>({
    id: null,
    name: null,
  });
  const [memo, setMemo] = useState<string>("");
  const [photo, setPhoto] = useState<File | null>();
  const [video, setVideo] = useState<File | null>();
  const [tags, setTags] = useState<User[]>([]);
  const [album, setAlbum] = useState<Album | null>(null);
  const [selectedPrivateAlbumIds, setSelectedPrivateAlbumIds] = useState<
    number[]
  >([]);
  const [isButtonEnabled, setIsButtonEnabled] = useState<boolean>(false);
  const [isAlbumModalOpen, setIsAlbumModalOpen] = useState<boolean>(false);
  const [selectedAlbum, setSelectedAlbum] = useState<string>("personal");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    setPhoto(null);
    setVideo(null);
  }, []);

  useEffect(() => {
    const hasDate = date?.startDate !== null;
    const hasSpot = spot.id !== null;
    const hasMemo = memo.trim() !== "";
    const hasMediaContent = photo !== null || video != null;
    const hasRequiredTag =
      shareSelection === "내 앨범" ||
      (shareSelection === "공유" && (tags.length > 0 || album !== null));

    setIsButtonEnabled(
      hasDate && hasSpot && hasMemo && hasMediaContent && hasRequiredTag
    );
  }, [date, spot, memo, photo, video, tags, album, shareSelection]);

  useEffect(() => {
    if (tags.length > 0) {
      const privateAlbumIds = tags.map((tag) => tag.privateAlbumId);
      setSelectedPrivateAlbumIds(privateAlbumIds);
    } else {
      setSelectedPrivateAlbumIds([]);
    }
  }, [tags]);

  const handleModalSuccess = (newAlbum: Album) => {
    alert("앨범 생성에 성공했습니다!");
    setAlbum(newAlbum);
    setSelectedAlbum("album");
    setIsAlbumModalOpen(false);
  };

  const handleRegister = async () => {
    if (!date || !date.startDate || !isButtonEnabled || isLoading) return;

    const formattedDate = new Date(date.startDate).toISOString().split("T")[0];

    const memoryData = {
      date: formattedDate,
      spotId: spot.id!,
      content: memo,
      albumIds:
        shareSelection === "내 앨범"
          ? []
          : selectedAlbum === "personal"
          ? selectedPrivateAlbumIds
          : album
          ? [album.id!]
          : [],
      type:
        shareSelection !== "내 앨범" && selectedAlbum === "album"
          ? "PUBLIC"
          : "PRIVATE",
    };

    const formData = new FormData();
    formData.append(
      "memory",
      new Blob([JSON.stringify(memoryData)], { type: "application/json" })
    );
    if (photo) formData.append("photo", photo);
    if (video) formData.append("video", video);

    setIsLoading(true);

    try {
      await sendMemoryData(formData);
      alert("추억이 성공적으로 등록되었습니다!");
      navigate("/home");
    } catch (error) {
      alert("추억 등록 중 오류가 발생했습니다. 다시 시도해주세요.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header title="추억 기록" />
      <div className="bg-[#F9F9F9] min-h-screen pt-20 pb-20 pl-6 pr-6 flex flex-col items-center">
        <DatePicker value={date} onChange={(newValue) => setDate(newValue)} />
        <SearchSpot
          imageSrc="/assets/map-icon.png"
          placeholder="장소"
          onChange={setSpot}
          selectedSpot={spot}
        />
        <MemoInput
          memo={memo}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setMemo(e.target.value)
          }
        />
        <MediaUploadSection onPhotoUpload={setPhoto} onVideoUpload={setVideo} />
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
                onChange={setTags}
              />
            ) : (
              <SearchAlbum
                imageSrc="/assets/tag-icon.png"
                placeholder="태그"
                onChange={setAlbum}
                selectedAlbum={album}
              />
            )}
          </>
        )}

        <div className="flex items-center justify-end w-full max-w-md mt-4">
          {!isButtonEnabled && (
            <p className="text-sm text-[#FF4D4F] mr-4">
              모든 값을 입력해 주세요.
            </p>
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
            {isLoading ? "등록 중..." : "등록"}
          </button>
        </div>

        <CreateAlbumModal
          isOpen={isAlbumModalOpen}
          onClose={() => setIsAlbumModalOpen(false)}
          onSuccess={handleModalSuccess}
        />
      </div>
      <Footer />
    </>
  );
};

export default Record;
