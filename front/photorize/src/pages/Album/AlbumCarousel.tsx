import React, { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import AlbumItem from "../../components/Common/AlbumItem";
import { AlbumData } from "./useAlbum";

interface AlbumCarouselProps {
  albums: AlbumData[];
}

const AlbumCarousel: React.FC<AlbumCarouselProps> = ({ albums }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const handlePrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  );

  const handleNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  );

  if (albums.length === 0) {
    // 앨범이 없을 때 별도 UI를 표현할 수도 있음
    return (
      <div className="flex justify-center items-center h-60">
        <p className="text-gray-500">앨범이 아직 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[calc(90vh-160px)] flex justify-center items-center">
      {/* 이전 버튼 */}
      {albums.length > 0 && (
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 transform -translate-y-1/2
                     bg-gray-700 bg-opacity-50 text-white p-2 rounded-full z-10"
        >
          {"<"}
        </button>
      )}

      {/* 캐러셀 뷰포트 */}
      <div className="embla" ref={emblaRef}>
        <div className="embla__container flex">
          {albums.map((album) => (
            <div
              className="embla__slide flex-shrink-0 w-full max-w-lg flex justify-center items-center px-2"
              key={album.albumId}
            >
              <div className="w-full flex justify-center items-center">
                <AlbumItem
                  id={album.albumId}
                  name={album.name}
                  color={album.colorCode}
                  type={album.type}
                  isEditable
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 다음 버튼 */}
      {albums.length > 0 && (
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2
                     bg-gray-700 bg-opacity-50 text-white p-2 rounded-full z-10"
        >
          {">"}
        </button>
      )}
    </div>
  );
};

export default AlbumCarousel;
