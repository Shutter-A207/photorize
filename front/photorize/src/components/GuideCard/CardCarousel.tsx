import React, { useState } from "react";
import Card from "./Card";
import { CardProps } from "./Guide";

interface CardCarouselProps {
  cards: CardProps[];
  onFinish: () => void; // Carousel 종료 핸들러
}

const CardCarousel: React.FC<CardCarouselProps> = ({ cards, onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    } else {
      onFinish(); // 시작 버튼 클릭 시 Carousel 종료
    }
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? cards.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-md flex flex-col justify-between w-80 h-90 relative z-20">
      <div className="flex-grow">
        <Card {...cards[currentIndex]} />
      </div>
      <div className="p-4 flex flex-col items-center">
        <div className="flex space-x-2 mb-2">
          {cards.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentIndex ? "bg-[#FF93A5]" : "bg-gray-300"
              }`}
            ></div>
          ))}
        </div>
        <div className="flex justify-between w-full">
          <button
            onClick={onFinish}
            className="text-gray-600 text-sm hover:underline"
          >
            건너뛰기
          </button>
          <button
            onClick={handleNext}
            className={`text-sm font-medium ${
              currentIndex === cards.length - 1
                ? "text-[#4CAF50]"
                : "text-[#FF93A5]"
            }`}
          >
            {currentIndex === cards.length - 1 ? "시작" : "다음"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardCarousel;
