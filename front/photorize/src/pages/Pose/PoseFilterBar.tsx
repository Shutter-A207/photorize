import React from "react";

interface PoseFilterBarProps {
  selectedPeople: string;
  onSelectPeople: (people: string) => void;
  showLikedOnly: boolean;
  onToggleLiked: () => void;
}

const PEOPLE_OPTIONS = ["1인", "2인", "3~4인", "5인 이상"];

const PoseFilterBar: React.FC<PoseFilterBarProps> = ({
  selectedPeople,
  onSelectPeople,
  showLikedOnly,
  onToggleLiked,
}) => {
  return (
    <div className="flex flex-col justify-between mb-4">
      {/* 인원 필터 버튼들 */}
      <div className="flex space-x-2">
        {PEOPLE_OPTIONS.map((people) => (
          <button
            key={people}
            onClick={() => onSelectPeople(people)}
            className={`px-4 py-1 rounded-full font-bold ${
              selectedPeople === people
                ? "bg-[#FF93A5] text-white"
                : "border border-[#FF93A5] bg-white text-[#FF93A5]"
            }`}
          >
            {people}
          </button>
        ))}
      </div>

      {/* 좋아요만 보기 스위치 */}
      <div className="flex justify-end items-center space-x-2 mt-3">
        <span className="text-[#818181] font-bold text-sm">
          내가 좋아요 한 포즈
        </span>
        <label className="relative inline-block w-11 h-6">
          <input
            type="checkbox"
            checked={showLikedOnly}
            onChange={onToggleLiked}
            className="opacity-0 w-0 h-0"
          />
          <span
            className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition duration-200 ${
              showLikedOnly ? "bg-[#FF93A5]" : "bg-gray-300"
            }`}
          ></span>
          <span
            className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 transform ${
              showLikedOnly ? "translate-x-5" : ""
            }`}
          ></span>
        </label>
      </div>
    </div>
  );
};

export default PoseFilterBar;
