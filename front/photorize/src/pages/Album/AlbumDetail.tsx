import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/Common/Header";
import Footer from "../../components/Common/Footer";
import { fetchAlbumDetails } from "../../api/AlbumAPI";
import { useToast } from "../../components/Common/ToastProvider";

interface ImageData {
  memoryId: number;
  url: string;
  spotName: string;
  date: string;
}

interface MemberData {
  memberId: number;
  nickname: string;
  img: string;
  status: boolean;
}

interface AlbumDetailData {
  name: string;
  members: MemberData[];
  memories: ImageData[];
}

const AlbumDetail: React.FC = () => {
  const { showToast } = useToast();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [albumDetail, setAlbumDetail] = useState<AlbumDetailData | null>(null);
  const [pageNumber, setPageNumber] = useState(0);
  const [hasNext, setHasNext] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const loadAlbumDetail = async () => {
      if (id && hasNext) {
        try {
          const response = await fetchAlbumDetails(Number(id), pageNumber);
          if (response && response.status === 200) {
            setAlbumDetail((prevDetail) => {
              const newMemories = response.data.content[0].memories;
              return {
                ...response.data.content[0],
                memories: prevDetail
                  ? [...prevDetail.memories, ...newMemories]
                  : newMemories,
              };
            });
            setHasNext(response.data.hasNext);
          }
        } catch {
          showToast("추억 리스트 조회 중 오류 발생", "warning");
        }
      }
    };

    loadAlbumDetail();
  }, [id, pageNumber, hasNext]);

  const lastMemoryElementRef = useCallback(
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

  const handleImageClick = (memoryId: number) => {
    navigate(`/memory/${memoryId}`, {
      state: {
        albumId: Number(id),
      },
    });
  };

  if (!albumDetail) {
    return <div>Loading...</div>; // 로딩 중 표시
  }

  // 열을 나누어 각각의 열에 이미지 할당
  const leftColumnImages = albumDetail.memories.filter(
    (_, index) => index % 2 === 0
  );
  const rightColumnImages = albumDetail.memories.filter(
    (_, index) => index % 2 !== 0
  );

  return (
    <div className="bg-[#F9F9F9] min-h-screen pt-14 pb-20">
      <Header title={albumDetail.name} />
      <div className="p-4">
        {/* 유저 리스트 */}
        {albumDetail.members.length > 1 && (
          <div className="flex overflow-x-auto space-x-4">
            {albumDetail.members.map((member) => (
              <div
                key={member.memberId}
                className={`flex flex-col items-center ${!member.status ? "opacity-40" : ""
                  }`}
              >
                <img
                  src={member.img}
                  alt={member.nickname}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <p className="text-sm mt-1 font-bold text-[#343434]">
                  {member.nickname}
                </p>
              </div>
            ))}
          </div>
        )}

        {albumDetail.members.length > 1 && (
          <div className="border-t border-gray-200 mt-2 mb-6"></div>
        )}

        {albumDetail.memories.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-32">
            <img
              src="/assets/no-memories.png"
              alt="No memories"
              className="w-32 h-32 mb-4"
            />
            <p className="text-gray-500 text-base">추억이 아직 없어요!</p>
          </div>
        ) : (
          // 두 열로 나누어진 Masonry 스타일 레이아웃
          <div className="flex gap-4">
            {/* 왼쪽 열 */}
            <div className="flex flex-col gap-4 w-[48%]">
              {leftColumnImages.map((image) => (
                <div
                  key={image.memoryId}
                  className="flex flex-col items-center"
                  onClick={() => handleImageClick(image.memoryId)}
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

            {/* 오른쪽 열 */}
            <div className="flex flex-col gap-4 w-[48%]">
              {rightColumnImages.map((image, index) => {
                const isLastElement = index === rightColumnImages.length - 1;
                return (
                  <div
                    key={image.memoryId}
                    className="flex flex-col items-center"
                    ref={isLastElement ? lastMemoryElementRef : null}
                    onClick={() => handleImageClick(image.memoryId)}
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
        )}
      </div>
      <Footer />
    </div>
  );
};

export default AlbumDetail;
