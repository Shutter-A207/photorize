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
  const [locationName, setLocationName] = useState<string>("");
  const [selectedSpot, setSelectedSpot] = useState<Spot>({
    id: null,
    name: null,
  });
  const [memo, setMemo] = useState<string>("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [isButtonEnabled, setIsButtonEnabled] = useState<boolean>(false);

  // 기존 데이터를 설정
  useEffect(() => {
    if (memoryDetail) {
      // 날짜 설정
      const date = memoryDetail.date ? new Date(memoryDetail.date) : null;
      setValue({
        startDate: date,
        endDate: date,
      });

      // spotId가 존재하는 경우에만 spot 정보 설정
      if (memoryDetail.spotId) {
        const spotData = {
          id: memoryDetail.spotId,
          name: memoryDetail.spotName || "",
        };
        setSelectedSpot(spotData);
        setLocationName(memoryDetail.spotName || "");
      }

      setMemo(memoryDetail.content || "");
    } else if (id) {
      fetchMemory(Number(id))
        .then((response) => {
          // 날짜 설정
          const date = response.date ? new Date(response.date) : null;
          setValue({
            startDate: date,
            endDate: date,
          });

          // spotId가 존재하는 경우에만 spot 정보 설정
          if (response.spotId) {
            const spotData = {
              id: response.spotId,
              name: response.spotName || "",
            };
            setSelectedSpot(spotData);
            setLocationName(response.spotName || "");
          }

          setMemo(response.content || "");
        })
        .catch((error) => {
          console.error("Failed to fetch memory details:", error);
        });
    }
  }, [memoryDetail, id]);

  // spot 변경 핸들러
  const handleSpotChange = (spot: Spot) => {
    setSelectedSpot(spot);
    setLocationName(spot.name || "");
  };

  // 유효성 검사
  useEffect(() => {
    const hasDate = value?.startDate !== null;
    const hasLocation = locationName.trim() !== "";
    const hasMemo = memo.trim() !== "";
    const hasMediaContent = photos.length > 0 || videos.length > 0;

    setIsButtonEnabled(hasDate && hasLocation && hasMemo && hasMediaContent);
  }, [value, locationName, memo, photos, videos]);

  return (
    <>
      <Header title="추억 수정" />
      <div className="bg-[#F9F9F9] min-h-screen pt-20 pb-20 pl-6 pr-6 flex flex-col items-center">
        <DatePicker value={value} onChange={(newValue) => setValue(newValue)} />
        <SearchSpot
          imageSrc="/assets/map-icon.png"
          placeholder="장소"
          onChange={handleSpotChange}
          selectedSpot={selectedSpot}
        />
        <MemoInput
          memo={memo}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setMemo(e.target.value)
          }
        />
        <MediaUploadSection
          onPhotoUpload={(file) => setPhotos(file ? [file] : [])}
          onVideoUpload={(file) => setVideos(file ? [file] : [])}
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
