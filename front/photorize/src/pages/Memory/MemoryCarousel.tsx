import React from "react";
import ReactPlayer from "react-player";
import { CarouselItem } from "./useMemory";

interface MemoryCarouselProps {
  carouselData: CarouselItem[];
  onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
  currentIndex: number;
}

const MemoryCarousel: React.FC<MemoryCarouselProps> = ({
  carouselData,
  onScroll,
  currentIndex,
}) => {
  if (carouselData.length === 0) {
    // 데이터가 없을 때 처리는 상황에 맞게
    return <div className="text-center p-4">No media</div>;
  }

  return (
    <div
      className="carousel bg-white rounded-xl overflow-hidden mb-4 p-1"
      style={{
        boxShadow: "0px 2px 2px rgba(0, 0, 0, 0.25)",
      }}
    >
      <div className="flex overflow-x-auto snap-x snap-mandatory" onScroll={onScroll}>
        {carouselData.map((item, idx) => (
          <div
            key={`${item.url}-${idx}`}
            className="snap-center w-full flex-shrink-0"
          >
            {item.type === "PHOTO" ? (
              <img
                src={item.url}
                alt={`Carousel item`}
                className="w-full h-auto object-cover"
              />
            ) : (
              <ReactPlayer
                url={item.url}
                controls
                width="100%"
                height="auto"
                className="rounded-lg"
              />
            )}
          </div>
        ))}
      </div>
      {/* 인디케이터 */}
      <div className="flex justify-center py-3">
        {carouselData.map((_, index) => (
          <div
            key={index}
            className={`h-2 w-2 rounded-full mx-2 ${
              index === currentIndex ? "bg-[#FF93A5]" : "bg-gray-400"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default MemoryCarousel;
