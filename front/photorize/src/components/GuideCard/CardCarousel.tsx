import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Card from "./Card";
import { CardProps } from "./Guide";

interface CardCarouselProps {
  cards: CardProps[];
  onFinish: () => void; // 바로 시작하기 버튼 핸들러
}

const CardCarousel: React.FC<CardCarouselProps> = ({ cards, onFinish }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [currentIndex, setCurrentIndex] = useState(0);

  // Embla 상태 업데이트
  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setCurrentIndex(emblaApi.selectedScrollSnap()); // 현재 슬라이드 인덱스 설정
    };

    emblaApi.on("select", onSelect); // 슬라이드가 바뀔 때마다 호출
    onSelect(); // 초기 슬라이드 설정

    return () => emblaApi.off("select", onSelect); // 정리(clean-up) 함수
  }, [emblaApi]);

  return (
    <div className="w-full max-w-md mx-auto relative z-20">
      {/* 캐러셀 영역 */}
      <div className="embla overflow-hidden" ref={emblaRef}>
        <div className="embla__container flex">
          {cards.map((card, index) => (
            <div
              className="embla__slide flex-shrink-0 w-full flex flex-col items-center"
              key={index}
            >
              {/* 카드와 하단바 포함 */}
              <div className="bg-white border border-gray-200 rounded-2xl shadow-md w-80 h-90 flex flex-col">
                <Card {...card} />
                {/* 하단 네비게이션 */}
                <div className="p-4 flex flex-col items-center">
                  {/* 현재 슬라이드 표시 */}
                  <div className="flex space-x-2 mb-4">
                    {cards.map((_, dotIndex) => (
                      <div
                        key={dotIndex}
                        className={`w-2 h-2 rounded-full ${
                          dotIndex === currentIndex
                            ? "bg-[#FF93A5]"
                            : "bg-gray-300"
                        }`}
                      ></div>
                    ))}
                  </div>

                  {/* 바로 시작하기 버튼 */}
                  <button
                    onClick={onFinish}
                    className="bg-white text-[#FF93A5] border border-[#FF93A5] text-sm font-medium px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all"
                  >
                    바로 시작하기
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CardCarousel;
