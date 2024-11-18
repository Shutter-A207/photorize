import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import Header from "../../components/Common/Header";
import Footer from "../../components/Common/Footer";
import AlbumItem from "../../components/Common/AlbumItem";
import { fetchAllAlbums } from "../../api/AlbumAPI";
import CreateAlbumModal from "../../components/Album/CreateAlbumModal";
import { useToast } from "../../components/Common/ToastProvider";
import { useLoading } from "../../components/Common/Loader/LoadingContext";

interface AlbumData {
  albumId: number;
  name: string;
  type: string;
  colorId: number;
  colorCode: string;
}

const Album = () => {
  const { showToast } = useToast();
  const [albums, setAlbums] = useState<AlbumData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const { setIsLoading } = useLoading();

  const loadAlbums = async () => {
    setIsLoading(true);
    try {
      const response = await fetchAllAlbums();
      if (response && response.status === 200) {
        setAlbums(response.data);
      }
    } catch (error) {
      console.error("앨범 목록을 가져오는 중 오류가 발생했습니다.", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAlbums();
  }, []);

  const handleEditClick = () => {
    navigate("/album/edit");
  };

  const handleModalSuccess = () => {
    showToast("앨범 생성에 성공했습니다!", "success");
    setIsModalOpen(false);
    loadAlbums();
  };

  const handlePrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  );

  const handleNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  );

  return (
    <div className="bg-[#F9F9F9] min-h-screen pt-16 pb-20 overflow-hidden">
      <Header title="앨범 목록" />
      <div className="flex justify-between items-center mt-2 px-6">
        <div className="space-x-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-1 text-white rounded bg-[#FF93A5]"
          >
            추가
          </button>
          <button
            onClick={handleEditClick}
            className="px-4 py-1 text-white rounded bg-[#8B8B8B]"
          >
            편집
          </button>
        </div>
        <img
          src="/assets/squares.png"
          alt="Squares Icon"
          className="w-12 h-12 cursor-pointer"
          onClick={() => navigate("/album2")}
        />
      </div>

      <div className="flex justify-center items-center h-[calc(90vh-160px)] relative">
        {albums.length > 0 && (
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-700 bg-opacity-50 text-white p-2 rounded-full z-10"
          >
            {"<"}
          </button>
        )}

        <div className="embla" ref={emblaRef}>
          <div className="embla__container flex">
            {albums.map((album) => (
              <div
                className="embla__slide flex-shrink-0 w-full max-w-lg flex justify-center items-center px-4"
                key={album.albumId}
              >
                <div className="w-full flex justify-center items-center">
                  <AlbumItem
                    id={album.albumId}
                    name={album.name}
                    color={album.colorCode}
                    type={album.type}
                    isEditable={true}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {albums.length > 0 && (
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-700 bg-opacity-50 text-white p-2 rounded-full z-10"
          >
            {">"}
          </button>
        )}
      </div>

      <Footer />

      <CreateAlbumModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
};

export default Album;
