import React from "react";
import { PoseData } from "./usePose";

interface PoseGridProps {
  poseData: PoseData[];
  onImageClick: (img: string) => void;
  onLikeToggle: (poseId: number) => void;
}

const PoseGrid: React.FC<PoseGridProps> = ({
  poseData,
  onImageClick,
  onLikeToggle,
}) => {
  // 왼쪽, 오른쪽 컬럼 분할
  const leftColumn = poseData.filter((_, index) => index % 2 === 0);
  const rightColumn = poseData.filter((_, index) => index % 2 !== 0);

  return (
    <div className="flex gap-4">
      {/* 왼쪽 컬럼 */}
      <div className="flex flex-col gap-4 w-[48%]">
        {leftColumn.map((pose) => (
          <div key={pose.poseId} className="relative">
            <img
              src={pose.img}
              alt={`Pose ${pose.poseId}`}
              className="w-full h-auto rounded-lg object-cover mb-1 cursor-pointer"
              onClick={() => onImageClick(pose.img)}
            />
            <div className="flex items-center justify-end mt-1 text-gray-500">
              <span className="text-[#818181] font-bold mr-2">
                {pose.likeCount}
              </span>
              <button onClick={() => onLikeToggle(pose.poseId)}>
                <img
                  src={
                    pose.liked
                      ? "/assets/heartIcon2.png"
                      : "/assets/heartIcon1.png"
                  }
                  alt="heart icon"
                  className="w-[20px] h-[18px]"
                />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 오른쪽 컬럼 */}
      <div className="flex flex-col gap-4 w-[48%]">
        {rightColumn.map((pose) => (
          <div key={pose.poseId} className="relative">
            <img
              src={pose.img}
              alt={`Pose ${pose.poseId}`}
              className="w-full h-auto rounded-lg object-cover mb-1 cursor-pointer"
              onClick={() => onImageClick(pose.img)}
            />
            <div className="flex items-center justify-end mt-1 text-gray-500">
              <span className="text-[#818181] font-bold mr-2">
                {pose.likeCount}
              </span>
              <button onClick={() => onLikeToggle(pose.poseId)}>
                <img
                  src={
                    pose.liked
                      ? "/assets/heartIcon2.png"
                      : "/assets/heartIcon1.png"
                  }
                  alt="heart icon"
                  className="w-[20px] h-[18px]"
                />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PoseGrid;
