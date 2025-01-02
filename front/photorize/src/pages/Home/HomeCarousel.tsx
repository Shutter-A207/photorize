import React from "react";
import { Memory } from "./useHome";

interface Props {
  memories: Memory[];
  emblaRef: (node: HTMLElement | null) => void;
  handlePrev: () => void;
  handleNext: () => void;
  onMemoryClick: (memoryId: number) => void; // 클릭 시 페이지 이동 등 처리
}

const HomeCarousel: React.FC<Props> = ({
  memories,
  emblaRef,
  handlePrev,
  handleNext,
  onMemoryClick,
}) => {
  if (memories.length === 0) {
    // 메모리가 없을 때의 UI(“아직 추억이 없네요!”)를 여기서 표시해도 되고,
    // 부모 컴포넌트에서 조건부 렌더링으로 처리해도 됩니다.
    return null;
  }

  return (
    <div className="flex justify-center items-center h-[calc(90vh-160px)] relative">
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-700 bg-opacity-50 text-white p-2 rounded-full z-10"
      >
        {"<"}
      </button>

      <div className="embla" ref={emblaRef}>
        <div className="embla__container flex">
          {memories.map((memory) => (
            <div
              className="embla__slide flex-shrink-0 w-full max-w-lg flex justify-center items-center px-4"
              key={memory.memoryId}
            >
              <div
                className="relative w-full flex justify-center items-center"
                onClick={() => onMemoryClick(memory.memoryId)}
              >
                <img
                  src={memory.url}
                  alt={`Memory ${memory.memoryId}`}
                  className="w-full max-h-[70vh] object-contain rounded-lg"
                />
                <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white p-2 rounded">
                  <p className="text-sm">{memory.date.split(" ")[0]}</p>
                  <p className="text-lg font-semibold">#{memory.albumName}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-700 bg-opacity-50 text-white p-2 rounded-full z-10"
      >
        {">"}
      </button>
    </div>
  );
};

export default HomeCarousel;
