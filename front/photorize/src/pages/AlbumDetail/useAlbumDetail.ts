import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchAlbumDetails } from "../../api/AlbumAPI";
import { resendAlarm } from "../../api/AlarmAPI";
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

export function useAlbumDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [albumDetail, setAlbumDetail] = useState<AlbumDetailData | null>(null);
  const [pageNumber, setPageNumber] = useState(0);
  const [hasNext, setHasNext] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const { showToast } = useToast();
  const { setIsLoading } = useLoading();
  const observerRef = useRef<IntersectionObserver | null>(null);

  // 모달 제어
  const [showModal, setShowModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<MemberData | null>(null);

  // 앨범 상세 데이터 불러오기
  useEffect(() => {
    const loadAlbumDetail = async () => {
      if (!id || !hasNext) return;
      // 초기 로딩 시만 전체 화면 로딩
      if (isInitialLoading) setIsLoading(true);

      try {
        const response = await fetchAlbumDetails(Number(id), pageNumber);
        if (response && response.status === 200) {
          // 새로 불러온 memories
          const newMemories = response.data.content[0].memories;
          setAlbumDetail((prevDetail) => {
            // 기존 데이터 + 새로 불러온 memories 합치기
            if (!prevDetail) return response.data.content[0];
            return {
              ...prevDetail,
              memories: [...prevDetail.memories, ...newMemories],
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
    };

    loadAlbumDetail();
  }, [id, pageNumber, hasNext, isInitialLoading, setIsLoading, showToast]);

  // 무한 스크롤 마지막 요소 ref
  const lastMemoryElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNext) {
          setPageNumber((prev) => prev + 1);
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [hasNext]
  );

  // 사진 클릭 -> 메모리 상세 페이지 이동
  const handleImageClick = (memoryId: number) => {
    if (!id) return;
    navigate(`/memory/${memoryId}`, {
      state: {
        albumId: Number(id),
      },
    });
  };

  // 멤버 클릭 -> 미참여(status=false)인 경우 모달 열기
  const handleMemberClick = (member: MemberData) => {
    if (!member.status) {
      setSelectedMember(member);
      setShowModal(true);
    }
  };

  // 모달에서 “확인” -> 알람 재전송
  const confirmResend = async () => {
    if (selectedMember && id) {
      try {
        await resendAlarm(Number(id), selectedMember.memberId);
        showToast(`${selectedMember.nickname}에게 알람을 재전송했습니다.`, "success");
      } catch {
        showToast("알람 재전송 중 오류 발생", "error");
      } finally {
        setShowModal(false);
        setSelectedMember(null);
      }
    }
  };

  // 모달 닫기
  const closeModal = () => {
    setShowModal(false);
    setSelectedMember(null);
  };

  return {
    albumDetail,
    lastMemoryElementRef,
    handleImageClick,
    handleMemberClick,
    showModal,
    selectedMember,
    confirmResend,
    closeModal,
  };
}
