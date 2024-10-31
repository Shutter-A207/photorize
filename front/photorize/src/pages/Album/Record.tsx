import React, { useState } from "react";
import Header from "../../components/Common/Header";
import Footer from "../../components/Common/Footer";
import DatePicker from "../../components/Album/DatePicker";
import { DateValueType } from "react-tailwindcss-datepicker";
import SearchSpot from "../../components/Common/SearchSpot.tsx";
import SearchTag from "../../components/Common/SearchTag.tsx";
import UploadItem from "../../components/Album/UploadItem.tsx";

const Record = () => {
  const [shareSelection, setShareSelection] = useState("내 앨범");
  const [value, setValue] = useState<DateValueType>({
    startDate: null,
    endDate: null,
  });
  const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);
  const [newAlbumName, setNewAlbumName] = useState("");
  const [selectedAlbum, setSelectedAlbum] = useState("개인");

  const handleValueChange = (newValue: DateValueType | null): void => {
    if (newValue) {
      setValue(newValue);
    }
  };

  const handleCreateAlbum = () => {
    setSelectedAlbum(newAlbumName);
    setIsAlbumModalOpen(false);
    setNewAlbumName("");
  };

  return (
    <>
      <Header title="추억 기록" />
      {/* 기록 페이지 */}
      <div className="bg-[#F9F9F9] min-h-screen pt-20 pb-20 pl-6 pr-6 flex flex-col items-center">
        {/* 날짜 입력 */}
        <DatePicker value={value} onChange={handleValueChange} />

        {/* 위치 입력 */}
        <SearchSpot imageSrc="/assets/map-icon.png" placeholder="장소" />

        {/* 설명 텍스트 */}
        <p className="text-[#818181] mb-4 text-sm">
          이 순간에 담긴 이야기를 작성해 주세요
        </p>

        {/* 메모 입력 */}
        <div className="flex items-left bg-white rounded-lg p-4 w-full max-w-md min-h-32 mb-4 border border-[#B3B3B3]">
          <img src="/assets/memo-icon.png" alt="Memo Icon" className="h-5" />
          <textarea
            placeholder="메모"
            className="flex-grow bg-transparent text-sm text-[#818181] placeholder-[#BCBFC3] placeholder:font-medium ml-2 outline-none"
          />
        </div>

        {/* 사진, GIF, 동영상 업로드 */}
        <div className="flex space-x-3 w-full max-w-md min-h-24">
          <UploadItem type="photo" />
          <UploadItem type="video" />
        </div>

        {/* 공유/등록 선택 */}
        <div className="relative flex items-center bg-[#E1E1E1] rounded-full p-1 w-full max-w-md h-10 mt-4 mb-4">
          <div
            className={`absolute top-0 bottom-0 left-0 w-1/2 bg-white border-2 m-1 border-[#FF93A5] rounded-full transition-transform duration-500 ${
              shareSelection === "공유" ? "translate-x-[95%]" : "translate-x-0"
            }`}
          ></div>

          <button
            onClick={() => setShareSelection("내 앨범")}
            className={`relative flex-1 text-center font-bold ${
              shareSelection === "내 앨범" ? "text-[#FF93A5]" : "text-[#787878]"
            }`}
          >
            내 앨범
          </button>
          <button
            onClick={() => setShareSelection("공유")}
            className={`relative flex-1 text-center font-bold ${
              shareSelection === "공유" ? "text-[#FF93A5]" : "text-[#787878]"
            }`}
          >
            공유
          </button>
        </div>
        <p className="text-[#818181] mb-4 text-sm">
          {shareSelection === "내 앨범"
            ? "소중한 순간을 당신의 앨범에 간직해 보세요"
            : "함께라서 더욱 특별했던 순간을 공유해 보세요"}
        </p>
        {shareSelection === "공유" ? (
          <>
            {/* 드롭다운과 새 앨범 만들기 링크 */}
            <div className="flex items-center justify-between w-full max-w-md mb-2">
              <select
                value={selectedAlbum}
                onChange={(e) => setSelectedAlbum(e.target.value)}
                className="bg-white border border-[#B3B3B3] rounded-lg p-2 text-sm text-[#343434] outline-none"
              >
                <option value="personal">개인</option>
                <option value="album">앨범</option>
              </select>

              <button
                onClick={() => setIsAlbumModalOpen(true)}
                className="text-[#818181] text-sm font-medium underline "
              >
                새 앨범 만들기
              </button>
            </div>
            <SearchTag imageSrc="/assets/tag-icon.png" placeholder="태그" />
          </>
        ) : null}
        <div className="flex justify-end w-full max-w-md mt-4">
          <button className="bg-[#FF93A5] text-white text-sm font-medium py-2 px-4 rounded-full">
            등록
          </button>
        </div>

        {/* 앨범 생성 모달 */}
        {isAlbumModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-80">
              <h2 className="text-base text-[#818181] font-bold mb-4">
                새 앨범 만들기
              </h2>
              <input
                type="text"
                placeholder="앨범 이름 입력"
                value={newAlbumName}
                onChange={(e) => setNewAlbumName(e.target.value)}
                className="w-full border border-[#B3B3B3] rounded-lg p-2 mb-4 text-sm text-[#818181] placeholder-[#BCBFC3] outline-none"
              />
              <SearchTag imageSrc="/assets/tag-icon.png" placeholder="태그" />
              <button
                onClick={handleCreateAlbum}
                className="bg-[#FF93A5] text-white text-sm font-medium py-2 px-4 rounded-full w-full"
              >
                생성
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Record;
