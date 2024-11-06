import React, { useState, useEffect } from "react";
import Header from "../../components/Common/Header";
import Footer from "../../components/Common/Footer";
import DatePicker from "../../components/Album/DatePicker";
import { DateValueType } from "react-tailwindcss-datepicker";
import SearchSpot from "../../components/Common/SearchSpot";
import MemoInput from "../../components/Album/MemoInput";
import MediaUploadSection from "../../components/Album/MediaUploadSection";

const ModifyMemory: React.FC = () => {
  // 기존 정보를 기본값으로 설정
  const [value, setValue] = useState<DateValueType>({
    startDate: null, // 기존 날짜
    endDate: null,
  });
  const [location, setLocation] = useState<string>("인생네컷 역삼점"); // 기존 장소
  const [memo, setMemo] = useState<string>(
    "팀원들과 친해질 수 있었던 Field Trip 너무너무 재미있었다 ~~"
  ); // 기존 메모
  const [photos, setPhotos] = useState<File[]>([]); // 기존 사진 데이터 설정
  const [videos, setVideos] = useState<File[]>([]); // 기존 동영상 데이터 설정
  const [isButtonEnabled, setIsButtonEnabled] = useState<boolean>(false);

  useEffect(() => {
    const hasDate = value?.startDate !== null;
    const hasLocation = location.trim() !== "";
    const hasMemo = memo.trim() !== "";
    const hasMediaContent = photos.length > 0 || videos.length > 0;

    setIsButtonEnabled(hasDate && hasLocation && hasMemo && hasMediaContent);
  }, [value, location, memo, photos, videos]);

  return (
    <>
      <Header title="추억 수정" />
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

        <div className="flex items-center justify-end w-full max-w-md mt-4">
          {!isButtonEnabled && (
            <p className="text-sm text-[#FF4D4F] mr-4">
              모든 값을 입력해 주세요.
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
            수정
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ModifyMemory;
