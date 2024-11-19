import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/Common/Header";
import Footer from "../../components/Common/Footer";
import ConfirmationModal from "../../components/Common/ConfirmationModal";
import { fetchAlbumDetails } from "../../api/AlbumAPI";
import { resendAlarm } from "../../api/AlarmAPI"; // 재전송 API 추가
import { useToast } from "../../components/Common/ToastProvider";
import { useLoading } from "../../components/Common/Loader/LoadingContext";

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

  const [showModal, setShowModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<MemberData | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const { setIsLoading } = useLoading();

  useEffect(() => {
    const loadAlbumDetail = async () => {
      if (id && hasNext) {
        if (isInitialLoading) setIsLoading(true);
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
        } catch (error: any) {
          const errorMessage =
            error?.response?.data?.message ||
            "추억 리스트 조회 중 오류가 발생했습니다.";
          showToast(errorMessage, "error");
        } finally {
          setIsLoading(false);
          setIsInitialLoading(false);
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

  const handleMemberClick = (member: MemberData) => {
    if (!member.status) {
      setSelectedMember(member);
      setShowModal(true);
    }
  };

  const confirmResend = async () => {
    if (selectedMember && id) {
      try {
        await resendAlarm(Number(id), selectedMember.memberId);
        showToast(
          `${selectedMember.nickname}에게 알람을 재전송했습니다.`,
          "success"
        );
      } catch {
        showToast("알람 재전송 중 오류 발생", "error");
      } finally {
        setShowModal(false);
        setSelectedMember(null);
      }
    }
  };

  if (!albumDetail) {
    return <div>Loading...</div>; // 로딩 중 표시
  }

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
          <div
            className="flex overflow-x-auto scrollbar-hide"
            style={{
              maxWidth: "100%", // 화면 너비를 초과하지 않도록 설정
              paddingBottom: "8px", // 스크롤바 영역 확보
            }}
          >
            <div className="flex space-x-4">
              {albumDetail.members.map((member) => (
                <div
                  key={member.memberId}
                  className={`flex flex-col items-center w-[60px] flex-shrink-0 ${
                    !member.status ? "opacity-40" : ""
                  }`}
                  onClick={() => handleMemberClick(member)} // 이미지 클릭 이벤트 추가
                >
                  <img
                    src={member.img}
                    alt={member.nickname}
                    className="w-12 h-12 rounded-full object-cover cursor-pointer"
                  />
                  <p className="text-sm mt-1 font-bold text-[#343434] text-center truncate">
                    {member.nickname}
                  </p>
                </div>
              ))}
            </div>
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
          <div className="flex gap-4">
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

      {/* Confirmation Modal */}
      {showModal && selectedMember && (
        <ConfirmationModal
          message={`${selectedMember.nickname}님에게 알람을 재전송하시겠습니까?`}
          onConfirm={confirmResend}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default AlbumDetail;
