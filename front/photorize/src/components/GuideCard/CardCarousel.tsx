import React, { useState } from 'react';
import Card from './Card'; // 단일 카드 컴포넌트
import { CardProps } from './Guide';

interface CardCarouselProps {
  cards: CardProps[];
}

const CardCarousel: React.FC<CardCarouselProps> = ({ cards }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? cards.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="relative w-80 h-90 bg-white border border-gray-200 rounded-2xl shadow-md flex flex-col justify-between">
        {/* 현재 카드 */}
        <div className="flex-grow">
          <Card {...cards[currentIndex]} />
        </div>


        <div className="p-4 flex flex-col items-center">
          <div className="flex space-x-2 mb-2">
            {cards.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentIndex
                    ? 'bg-[#FF93A5]'
                    : 'bg-gray-300'
                }`}
              ></div>
            ))}
          </div>

          <div className="flex justify-between w-full">
            <button
              onClick={handlePrev}
              className="text-gray-600 text-sm hover:underline"
            >
              건너뛰기
            </button>

            <button
              onClick={handleNext}
              className="text-[#FF93A5] text-sm font-medium"
            >
              다음
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardCarousel;
