import React, { useMemo } from "react";

interface ImageData {
  memoryId: number;
  url: string;
  spotName: string;
  date: string;
}

interface MemoryGridProps {
  memories: ImageData[];
  onImageClick: (memoryId: number) => void;
  lastMemoryElementRef: (node: HTMLDivElement | null) => void;
}

const MemoryGrid: React.FC<MemoryGridProps> = ({
  memories,
  onImageClick,
  lastMemoryElementRef,
}) => {
  // 왼쪽, 오른쪽 컬럼 분할
  const [leftColumnImages, rightColumnImages] = useMemo(() => {
    const left: ImageData[] = [];
    const right: ImageData[] = [];
    memories.forEach((img, idx) => {
      if (idx % 2 === 0) left.push(img);
      else right.push(img);
    });
    return [left, right];
  }, [memories]);

  if (memories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center mt-32">
        <img
          src="/assets/no-memories.png"
          alt="No memories"
          className="w-32 h-32 mb-4"
        />
        <p className="text-gray-500 text-base">추억이 아직 없어요!</p>
      </div>
    );
  }

  return (
    <div className="flex gap-4">
      {/* 왼쪽 컬럼 */}
      <div className="flex flex-col gap-4 w-[48%]">
        {leftColumnImages.map((image) => (
          <div
            key={image.memoryId}
            className="flex flex-col items-center"
            onClick={() => onImageClick(image.memoryId)}
          >
            <img
              src={image.url}
              alt={`Memory ${image.memoryId}`}
              className="w-full h-auto rounded-lg object-cover mb-1"
            />
            <div className="flex items-center justify-between w-full text-xs text-gray-500">
              <div className="flex items-center flex-1 overflow-hidden">
                <img
                  src="/assets/locationIcon.png"
                  alt="location icon"
                  className="w-2 h-3 mr-1"
                />
                <span className="text-[#343434] text-[10px] font-bold overflow-hidden whitespace-nowrap text-ellipsis">
                  {image.spotName}
                </span>
              </div>
              <span className="text-[#343434] text-[10px] w-16 text-right">
                {image.date.slice(0, 10)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 오른쪽 컬럼 */}
      <div className="flex flex-col gap-4 w-[48%]">
        {rightColumnImages.map((image, index) => {
          // 마지막 이미지에 ref 달기
          const isLastElement = index === rightColumnImages.length - 1;
          return (
            <div
              key={image.memoryId}
              className="flex flex-col items-center"
              ref={isLastElement ? lastMemoryElementRef : null}
              onClick={() => onImageClick(image.memoryId)}
            >
              <img
                src={image.url}
                alt={`Memory ${image.memoryId}`}
                className="w-full h-auto rounded-lg object-cover mb-1"
              />
              <div className="flex items-center justify-between w-full text-xs text-gray-500">
                <div className="flex items-center flex-1 overflow-hidden">
                  <img
                    src="/assets/locationIcon.png"
                    alt="location icon"
                    className="w-2 h-3 mr-1"
                  />
                  <span className="text-[#343434] text-[10px] font-bold overflow-hidden whitespace-nowrap text-ellipsis">
                    {image.spotName}
                  </span>
                </div>
                <span className="text-[#343434] text-[10px] w-16 text-right">
                  {image.date.slice(0, 10)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MemoryGrid;
