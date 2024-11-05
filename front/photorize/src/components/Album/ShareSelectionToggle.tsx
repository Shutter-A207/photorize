import React from "react";

interface ShareSelectionToggleProps {
  shareSelection: string;
  onToggle: (selection: string) => void;
}

const ShareSelectionToggle: React.FC<ShareSelectionToggleProps> = ({
  shareSelection,
  onToggle,
}) => (
  <>
    <div className="relative flex items-center bg-[#E1E1E1] rounded-full p-1 w-full max-w-md h-10 mt-4 mb-4">
      <div
        className={`absolute top-0 bottom-0 left-0 w-1/2 bg-white border-2 m-1 border-[#FF93A5] rounded-full transition-transform duration-500 ${
          shareSelection === "공유" ? "translate-x-[95%]" : "translate-x-0"
        }`}
      ></div>
      <button
        onClick={() => onToggle("내 앨범")}
        className={`relative flex-1 text-center font-bold ${
          shareSelection === "내 앨범" ? "text-[#FF93A5]" : "text-[#787878]"
        }`}
      >
        내 앨범
      </button>
      <button
        onClick={() => onToggle("공유")}
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
  </>
);

export default ShareSelectionToggle;
