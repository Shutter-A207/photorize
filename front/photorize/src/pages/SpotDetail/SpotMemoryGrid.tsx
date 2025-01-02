import React from "react";
import { MemoryData } from "./useSpotDetail"; 

interface SpotMemoryGridProps {
  leftMemories: MemoryData[];
  rightMemories: MemoryData[];
  onMemoryClick: (memoryId: number) => void;
}

const SpotMemoryGrid: React.FC<SpotMemoryGridProps> = ({
  leftMemories,
  rightMemories,
  onMemoryClick,
}) => {
  return (
    <div className="flex gap-4">
      {/* 왼쪽 열 */}
      <div className="flex flex-col gap-4">
        {leftMemories.map((memory) => (
          <div
            key={memory.memoryId}
            className="flex flex-col items-center cursor-pointer"
            onClick={() => onMemoryClick(memory.memoryId)}
          >
            <img
              src={memory.fileUrl}
              alt={`Memory ${memory.memoryId}`}
              className="w-full h-auto rounded-lg object-cover mb-1"
            />
            <div className="flex items-center justify-between w-full text-xs text-gray-500">
              <div className="flex items-center">
                <span className="text-[#343434] text-[10px] font-bold">
                  {memory.albumName}
                </span>
              </div>
              <span className="text-[#343434] text-[10px]">
                {memory.date.slice(0, 10)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 오른쪽 열 */}
      <div className="flex flex-col gap-4">
        {rightMemories.map((memory) => (
          <div
            key={memory.memoryId}
            className="flex flex-col items-center cursor-pointer"
            onClick={() => onMemoryClick(memory.memoryId)}
          >
            <img
              src={memory.fileUrl}
              alt={`Memory ${memory.memoryId}`}
              className="w-full h-auto rounded-lg object-cover mb-1"
            />
            <div className="flex items-center justify-between w-full text-xs text-gray-500">
              <div className="flex items-center">
                <span className="text-[#343434] text-[10px] font-bold">
                  {memory.albumName}
                </span>
              </div>
              <span className="text-[#343434] text-[10px]">
                {memory.date.slice(0, 10)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpotMemoryGrid;
