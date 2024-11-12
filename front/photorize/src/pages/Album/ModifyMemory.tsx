import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import Header from "../../components/Common/Header";
import Footer from "../../components/Common/Footer";
import DatePicker from "../../components/Album/DatePicker";
import { DateValueType } from "react-tailwindcss-datepicker";
import SearchSpot from "../../components/Common/SearchSpot";
import MemoInput from "../../components/Album/MemoInput";
import MediaUploadSection from "../../components/Album/MediaUploadSection";
import { fetchMemory } from "../../api/MemoryAPI";

interface Spot {
  id: number | null;
  name: string | null;
}

const ModifyMemory: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const memoryDetail = location.state;

  const [value, setValue] = useState<DateValueType>({
    startDate: null,
    endDate: null,
  });
  const [locationName, setLocationName] = useState<Spot>({
    id: null,
    name: "",
  });
  const [memo, setMemo] = useState<string>("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [isButtonEnabled, setIsButtonEnabled] = useState<boolean>(false);

  // 기존 데이터를 설정
  useEffect(() => {
    if (memoryDetail) {
      setValue({
        startDate: memoryDetail.date ? new Date(memoryDetail.date) : null,
        endDate: null,
      });
      setLocationName({
        id: null,
        name: memoryDetail.spotName || "",
      });
      setMemo(memoryDetail.content || "");
    } else if (id) {
      // 서버에서 데이터 가져오기
      fetchMemory(Number(id))
        .then((response) => {
          setValue({
            startDate: response.date ? new Date(response.date) : null,
            endDate: null,
          });
          setLocationName({
            id: null,
            name: response.spotName || "",
          });
          setMemo(response.content || "");
        })
        .catch((error) => {
          console.error("Failed to fetch memory details:", error);
        });
    }
  }, [memoryDetail, id]);

  // 유효성 검사
  useEffect(() => {
    const hasDate = value?.startDate !== null;
    const hasLocation = locationName.name!.trim() !== "";
    const hasMemo = memo.trim() !== "";
    const hasMediaContent = photos.length > 0 || videos.length > 0;

    setIsButtonEnabled(hasDate && hasLocation && hasMemo && hasMediaContent);
  }, [value, locationName, memo, photos, videos]);

  const handlePhotoUpload = (file: File | null) => {
    setPhotos(file ? [file] : []);
  };

  const handleVideoUpload = (file: File | null) => {
    setVideos(file ? [file] : []);
  };

  const handleLocationChange = (spot: Spot) => {
    setLocationName(spot);
  };

  return (
    <>
      <Header title="추억 수정" />
      <div className="bg-[#F9F9F9] min-h-screen pt-20 pb-20 pl-6 pr-6 flex flex-col items-center">
        <DatePicker value={value} onChange={(newValue) => setValue(newValue)} />
        <SearchSpot
          imageSrc="/assets/map-icon.png"
          placeholder="장소"
          onChange={handleLocationChange}
          selectedSpot={locationName}
        />
        <MemoInput
          memo={memo}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setMemo(e.target.value)
          }
        />
        <MediaUploadSection
          onPhotoUpload={handlePhotoUpload}
          onVideoUpload={handleVideoUpload}
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
