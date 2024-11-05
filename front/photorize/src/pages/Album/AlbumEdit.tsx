import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Common/Header";
import Footer from "../../components/Common/Footer";
import AlbumItem from "../../components/Common/AlbumItem";
import { fetchAlbums } from "../../api/AlbumAPI";
import { deleteAlbum } from "../../api/AlbumAPI"; // 앨범 삭제 API 함수

interface AlbumData {
  albumId: number;
  name: string;
  type: string;
  colorId: number;
  colorCode: string;
}

const AlbumEdit = () => {
  const [albums, setAlbums] = useState<AlbumData[]>([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [hasNext, setHasNext] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const navigate = useNavigate();

  const loadAlbums = useCallback(async () => {
    if (hasNext) {
      try {
        const response = await fetchAlbums(pageNumber);
        if (response && response.status === 200) {
          setAlbums((prevAlbums) => [...prevAlbums, ...response.data.content]);
          setHasNext(response.data.hasNext);
        }
      } catch (error) {
        console.error("앨범 목록을 가져오는 중 오류가 발생했습니다.", error);
      }
    }
  }, [pageNumber, hasNext]);

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

  const handleDeleteAlbum = async (albumId: number) => {
    try {
      await deleteAlbum(albumId); // 삭제 API 호출
      setAlbums((prevAlbums) =>
        prevAlbums.filter((album) => album.albumId !== albumId)
      );
    } catch (error) {
      console.error("앨범 삭제 중 오류 발생:", error);
    }
  };

  const handleCompleteEdit = () => {
    navigate("/album"); // 앨범 목록 페이지로 이동
  };

  return (
    <div className="bg-[#F9F9F9] min-h-screen pt-16 pb-20">
      <Header title="앨범 수정" />
      <div className="flex justify-end mt-2 mr-4 space-x-2">
        <button
          onClick={handleCompleteEdit}
          className="px-4 py-1 text-white rounded bg-[#8B8B8B]"
        >
          완료
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3 p-4">
        {albums.map((album, index) => (
          <div key={album.albumId} className="relative">
            <AlbumItem
              id={album.albumId}
              name={album.name}
              color={album.colorCode}
              isEditable={false}
              ref={index === albums.length - 1 ? lastAlbumElementRef : null}
            />
            {/* 앨범 삭제 버튼 */}
            <button
              onClick={() => handleDeleteAlbum(album.albumId)}
              className="absolute top-1 right-2 rounded-full w-6 h-6 flex items-center justify-center"
            >
              <img
                src="/assets/remove-icon.png"
                alt="Remove icon"
                className="w-5 h-5" // 아이콘 크기 조정
              />
            </button>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default AlbumEdit;
