import React, { useState } from "react";
import Header from "../../components/Common/Header";
import Footer from "../../components/Common/Footer";

const Record = () => {
  const [shareSelection, setShareSelection] = useState("내 앨범");

  return (
    <>
      <Header title="추억 기록" />
      {/* 기록 페이지 */}
      <div className="bg-[#F9F9F9] min-h-screen pt-20 pb-20 pl-6 pr-6 flex flex-col items-center">
        {/* 날짜 입력 */}
        <div className="flex items-center bg-white rounded-lg p-4 w-full max-w-md mb-4 border border-[#B3B3B3]">
          <img src="/assets/date-icon.png" alt="Date Icon" className="h-5" />
          <input
            type="text"
            placeholder="날짜"
            className="flex-grow bg-transparent text-sm text-[#343434] placeholder-[#BCBFC3] placeholder:font-medium ml-2 outline-none"
          />
        </div>

        {/* 위치 입력 */}
        <div className="flex items-center bg-white rounded-lg p-4 w-full max-w-md mb-4 border border-[#B3B3B3]">
          <img src="/assets/map-icon.png" alt="Map Icon" className="h-5" />
          <input
            type="text"
            placeholder="위치"
            className="flex-grow bg-transparent text-sm text-[#343434] placeholder-[#BCBFC3] placeholder:font-medium ml-2 outline-none"
          />
        </div>

        {/* 설명 텍스트 */}
        <p className="text-[#818181] mb-4 text-sm">
          이 순간에 담긴 이야기를 작성해 주세요
        </p>

        {/* 메모 입력 */}
        <div className="flex items-left bg-white rounded-lg p-4 w-full max-w-md min-h-32 mb-4 border border-[#B3B3B3]">
          <img src="/assets/memo-icon.png" alt="Memo Icon" className="h-5" />
          <textarea
            placeholder="메모"
            className="flex-grow bg-transparent text-sm text-[#343434] placeholder-[#BCBFC3] placeholder:font-medium ml-2 outline-none"
          />
        </div>

        {/* 사진, GIF, 동영상 업로드 */}
        <div className="flex space-x-3 w-full max-w-md min-h-24">
          {/* 사진 업로드 */}
          <div className="flex items-left bg-white rounded-lg p-3 w-1/3 border border-[#B3B3B3]">
            <img
              src="/assets/picture-icon.png"
              alt="Picture Icon"
              className="h-4"
            />
            <span className="text-[#BCBFC3] text-xs font-medium\ ml-2">
              사진
            </span>
          </div>

          {/* GIF 업로드 */}
          <div className="flex items-left bg-white rounded-lg p-3 w-1/3 border border-[#B3B3B3]">
            <img src="/assets/gif-icon.png" alt="GIF Icon" className="h-4" />
            <span className="text-[#BCBFC3] text-xs font-medium ml-2">GIF</span>
          </div>

          {/* 동영상 업로드 */}
          <div className="flex items-left bg-white rounded-lg p-3 w-1/3 border border-[#B3B3B3]">
            <img
              src="/assets/video-icon.png"
              alt="Video Icon"
              className="h-4"
            />
            <span className="text-[#BCBFC3] text-xs font-medium ml-2">
              동영상
            </span>
          </div>
        </div>

        {/* 공유/등록 선택 */}
        <div className="relative flex items-center bg-[#E1E1E1] rounded-full p-1 w-full max-w-md h-10 mt-4 mb-4">
          {/* 슬라이더 (선택된 버튼 아래에 표시) */}
          <div
            className={`absolute top-0 bottom-0 left-0 w-1/2 bg-white border-2 m-1 border-[#FF93A5] rounded-full transition-transform duration-500 ${
              shareSelection === "공유" ? "translate-x-[95%]" : "translate-x-0"
            }`}
          ></div>

          <button
            onClick={() => setShareSelection("내 앨범")}
            className={`relative flex-1 text-center font-bold z-10 ${
              shareSelection === "내 앨범" ? "text-[#FF93A5]" : "text-[#787878]"
            }`}
          >
            내 앨범
          </button>
          <button
            onClick={() => setShareSelection("공유")}
            className={`relative flex-1 text-center font-bold z-10 ${
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
            <div className="flex items-center justify-between w-full max-w-md mb-4">
              {/* 드롭다운 */}
              <select className="bg-white border border-[#B3B3B3] rounded-lg p-2 text-sm text-[#343434] outline-none">
                <option value="personal">개인</option>
                <option value="album">앨범</option>
              </select>

              {/* 새 앨범 만들기 링크 */}
              <button className="text-[#818181] text-sm font-medium underline ">
                새 앨범 만들기
              </button>
            </div>
            <div className="flex items-center bg-white rounded-lg p-4 w-full max-w-md mb-4 border border-[#B3B3B3]">
              <img src="/assets/tag-icon.png" alt="Tag Icon" className="h-5" />
              <input
                type="text"
                placeholder="태그"
                className="flex-grow bg-transparent text-sm text-[#343434] placeholder-[#BCBFC3] placeholder:font-medium ml-2 outline-none"
              />
            </div>
          </>
        ) : (
          ""
        )}
        <div className="flex justify-end w-full max-w-md mt-4">
          <button className="bg-[#FF93A5] text-white text-sm font-medium py-2 px-4 rounded-full">
            등록
          </button>
        </div>
        {/* 기록 페이지 */}
      </div>
      <Footer />
    </>
  );
};

export default Record;
