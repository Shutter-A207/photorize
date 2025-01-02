import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Common/Header";
import Footer from "../../components/Common/Footer";
import AlbumItem2 from "../../components/Common/AlbumItem2";
import { fetchAlbums } from "../../api/AlbumAPI";
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
  const [pageNumber, setPageNumber] = useState(0);
  const [hasNext, setHasNext] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const { setIsLoading } = useLoading();
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const navigate = useNavigate();

  const loadAlbums = useCallback(async () => {
    if (isInitialLoading) setIsLoading(true);
    if (hasNext) {
      try {
        const response = await fetchAlbums(pageNumber);
        if (response && response.status === 200) {
          setAlbums((prevAlbums) => [...prevAlbums, ...response.data.content]);
          setHasNext(response.data.hasNext);
        }
      } catch (error) {
        console.error("앨범 목록을 가져오는 중 오류가 발생했습니다.", error);
      } finally {
        setIsLoading(false);
        setIsInitialLoading(false);
      }
    }
  }, [pageNumber, hasNext]);

  const handleEditClick = () => {
    navigate("/album/edit");
  };

  const handleModalSuccess = () => {
    showToast("앨범 생성에 성공했습니다!", "success");
    setIsModalOpen(false);
    window.location.reload();
  };

  useEffect(() => {
    loadAlbums();
  }, [pageNumber, loadAlbums]);

  const lastAlbumElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNext) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) observerRef.current.observe(node);
    },
    [hasNext]
  );

  return (
    <div className="bg-[#F9F9F9] min-h-screen pt-16 pb-20">
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
          src="/assets/carousel.png"
          alt="Moon Icon"
          className="w-12 h-12 cursor-pointer"
          onClick={() => navigate("/album")}
        />
      </div>
      <div className="grid grid-cols-2 gap-3 p-4">
        {albums.map((album, index) => (
          <AlbumItem2
            key={album.albumId}
            id={album.albumId}
            name={album.name}
            color={album.colorCode}
            type={album.type}
            isEditable={true}
            ref={index === albums.length - 1 ? lastAlbumElementRef : null}
          />
        ))}
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
