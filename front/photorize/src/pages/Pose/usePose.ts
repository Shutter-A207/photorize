import { useState, useEffect } from "react";
import { getAllPoses, likePose, unlikePose } from "../../api/PoseAPI";
import { useLoading } from "../../components/Common/Loader/LoadingContext";

export interface PoseData {
  poseId: number;
  img: string;
  headcount: string;
  likeCount: number;
  liked: boolean;
}

export function usePose() {
  const { setIsLoading } = useLoading();

  // 상태 정의
  const [selectedPeople, setSelectedPeople] = useState("");
  const [showLikedOnly, setShowLikedOnly] = useState(false);
  const [poseData, setPoseData] = useState<PoseData[]>([]);
  const [page, setPage] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState("");
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // 1) 인원 선택 필터 변경 시 → 페이지 초기화 & 데이터 재호출
  useEffect(() => {
    setPage(0);
    setPoseData([]);
    setHasMore(true);
    fetchPoses(0, convertPeopleToAPIFormat(selectedPeople));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPeople]);

  // 2) 스크롤 감지 → 무한 스크롤
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 100 >=
          document.documentElement.scrollHeight &&
        !isFetching &&
        hasMore
      ) {
        // 다음 페이지 데이터 불러오기
        fetchPoses(page, convertPeopleToAPIFormat(selectedPeople));
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isFetching, hasMore, page, selectedPeople]);

  // 3) 데이터 fetch
  const fetchPoses = async (pageNum: number, people?: string) => {
    if (isInitialLoading) setIsLoading(true);
    setIsFetching(true);
    try {
      const response = await getAllPoses(pageNum, people);
      const newPoses = response.data.content;
      setPoseData((prev) => [...prev, ...newPoses]);
      setHasMore(newPoses.length > 0);
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error("포즈 데이터를 가져오는 중 오류:", error);
    } finally {
      setIsLoading(false);
      setIsInitialLoading(false);
      setIsFetching(false);
    }
  };

  // 4) 인원 필터 처리
  const handlePeopleSelect = (people: string) => {
    // 같은 버튼을 다시 누르면 필터 해제
    setSelectedPeople(people === selectedPeople ? "" : people);
  };

  // 5) 좋아요 필터 토글
  const handleToggleLiked = () => {
    setShowLikedOnly((prev) => !prev);
  };

  // 6) 좋아요 / 좋아요 해제
  const handleLikeToggle = async (poseId: number) => {
    // Optimistic UI 업데이트
    const updatedPoses = poseData.map((pose) => {
      if (pose.poseId === poseId) {
        return {
          ...pose,
          liked: !pose.liked,
          likeCount: pose.liked ? pose.likeCount - 1 : pose.likeCount + 1,
        };
      }
      return pose;
    });
    setPoseData(updatedPoses);

    try {
      const targetPose = poseData.find((p) => p.poseId === poseId);
      if (targetPose?.liked) {
        await unlikePose(poseId);
      } else {
        await likePose(poseId);
      }
    } catch (error) {
      console.error("좋아요 토글 중 오류:", error);
      // 오류 발생 시 롤백
      setPoseData(poseData);
    }
  };

  // 7) 모달 열기/닫기
  const openModal = (image: string) => {
    setModalImage(image);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // 8) 인원 필터 값 → API 파라미터 변환
  const convertPeopleToAPIFormat = (people: string): string | undefined => {
    switch (people) {
      case "1인":
        return "ONE";
      case "2인":
        return "TWO";
      case "3~4인":
        return "THREE_OR_FOUR";
      case "5인 이상":
        return "FIVE_OR_MORE";
      default:
        return undefined;
    }
  };

  // 9) 좋아요 필터된 데이터
  const filteredPoseData = poseData.filter((pose) =>
    showLikedOnly ? pose.liked : true
  );

  return {
    selectedPeople,
    showLikedOnly,
    filteredPoseData,
    isModalOpen,
    modalImage,
    handlePeopleSelect,
    handleToggleLiked,
    handleLikeToggle,
    openModal,
    closeModal,
  };
}
