import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { fetchMemory, deleteMemory, fetchReviews } from "../../api/MemoryAPI";
import { createComment, deleteComment } from "../../api/CommentAPI";
import { useToast } from "../../components/Common/ToastProvider";
import { useLoading } from "../../components/Common/Loader/LoadingContext";

export interface CarouselItem {
  url: string;
  type: "PHOTO" | "VIDEO";
}

export interface MemoryDetail {
  writerId: number;
  nickname: string;
  writerImg: string;
  date: string;
  spotName: string;
  content: string;
}

export interface CommentType {
  commentId: number;
  writerImg: string;
  nickname: string;
  content: string;
  date: string;
}

export function useMemory() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const { albumId } = (location.state as { albumId?: number }) || {};
  const { showToast } = useToast();
  const { setIsLoading } = useLoading();

  // 추억 상세
  const [memoryDetail, setMemoryDetail] = useState<MemoryDetail | null>(null);
  // 캐러셀 데이터
  const [carouselData, setCarouselData] = useState<CarouselItem[]>([]);
  // 댓글 관련
  const [comments, setComments] = useState<CommentType[]>([]);
  const [newComment, setNewComment] = useState("");
  const [commentToDelete, setCommentToDelete] = useState<number | null>(null);
  // 메뉴, 모달 상태
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleteMemoryModalOpen, setDeleteMemoryModalOpen] = useState(false);
  const [deleteCommentModalOpen, setDeleteCommentModalOpen] = useState(false);
  // 에러 처리
  const [error, setError] = useState<string | null>(null);
  // 무한 스크롤
  const [pageNumber, setPageNumber] = useState(0);
  const [hasNext, setHasNext] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);
  // 로컬 유저정보
  const nickname = localStorage.getItem("nickname") || "익명";
  const img = localStorage.getItem("img") || "/assets/default-profile.png";
  // 댓글 등록 시 로딩 스피너
  const [isSpinning, setIsSpinning] = useState(false);

  // 1) 추억 상세 로드
  useEffect(() => {
    const loadMemory = async () => {
      try {
        setIsLoading(true);
        if (id) {
          const response = await fetchMemory(Number(id));
          if (response) {
            setMemoryDetail({
              writerId: response.writerId,
              nickname: response.nickname,
              writerImg: response.writerImg,
              date: response.date,
              spotName: response.spotName,
              content: response.content,
            });
            setCarouselData(
              response.files.map((file: any) => ({
                url: file.url,
                type: file.type === "PHOTO" ? "PHOTO" : "VIDEO",
              }))
            );
          }
        }
      } catch (err) {
        setError("추억 데이터를 불러오는 중 오류가 발생했습니다.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadMemory();
  }, [id, setIsLoading]);

  // 2) 댓글 (리뷰) 로드 - 무한 스크롤
  useEffect(() => {
    const loadReviews = async () => {
      if (!hasNext || !id) return;
      try {
        const data = await fetchReviews(pageNumber, Number(id));
        setComments((prev) => [...prev, ...data.content]);
        setHasNext(data.hasNext);
      } catch (err) {
        console.error("리뷰 데이터를 불러오는 중 오류 발생:", err);
      }
    };
    loadReviews();
  }, [pageNumber, hasNext, id]);

  // 3) 마지막 댓글 관찰자(ref)
  const lastCommentRef = useCallback(
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

  // 4) 댓글 등록
  const handleAddComment = async () => {
    if (newComment.trim() && id) {
      try {
        setIsSpinning(true);
        const commentResponse = await createComment(Number(id), newComment);
        const newCommentData: CommentType = {
          commentId: commentResponse.commentId,
          writerImg: img,
          nickname: nickname,
          content: commentResponse.content,
          // "2023-09-14T12:34:56" -> 원하는 형식으로 변환
          date: new Date(commentResponse.date)
            .toLocaleString("en-CA", { hour12: false })
            .slice(0, 19),
        };
        setComments((prev) => [newCommentData, ...prev]);
        setNewComment("");
      } catch (error) {
        console.error("댓글 등록 중 오류 발생:", error);
      } finally {
        setIsSpinning(false);
      }
    }
  };

  // 5) 댓글 삭제
  const handleDeleteComment = async () => {
    if (commentToDelete !== null) {
      try {
        await deleteComment(commentToDelete);
        setComments((prev) =>
          prev.filter((c) => c.commentId !== commentToDelete)
        );
        showToast("댓글이 삭제되었습니다.", "success");
      } catch (error) {
        console.error("댓글 삭제 중 오류 발생:", error);
        showToast("댓글 삭제에 실패했습니다.", "error");
      } finally {
        setCommentToDelete(null);
        setDeleteCommentModalOpen(false);
      }
    }
  };

  // 6) 추억 삭제
  const handleDeleteMemory = async () => {
    if (id) {
      try {
        await deleteMemory(Number(id));
        showToast("추억이 삭제되었습니다.", "success");
        navigate(`/album/${albumId}`);
      } catch (error) {
        console.error("추억 삭제 중 오류 발생:", error);
        showToast("추억 삭제에 실패했습니다.", "error");
      } finally {
        setDeleteMemoryModalOpen(false);
      }
    }
  };

  // 7) 메뉴 토글
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // 8) 캐러셀 인덱스 관리
  const [currentIndex, setCurrentIndex] = useState(0);
  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const scrollPosition = event.currentTarget.scrollLeft;
    const totalWidth = event.currentTarget.scrollWidth;
    if (carouselData.length > 0) {
      const itemWidth = totalWidth / carouselData.length;
      const newIndex = Math.round(scrollPosition / itemWidth);
      setCurrentIndex(newIndex);
    }
  };

  // 9) 시간 포맷
  const formatDate = (inputDate: string): string => {
    const date = new Date(inputDate);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / (1000 * 60));
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);
    const diffMonth = Math.floor(diffDay / 30);
    const diffYear = Math.floor(diffMonth / 12);

    if (diffYear >= 1) return diffYear === 1 ? "1년 전" : `${diffYear}년 전`;
    if (diffMonth >= 1) return diffMonth === 1 ? "1개월 전" : `${diffMonth}개월 전`;
    if (diffDay >= 1) return diffDay === 1 ? "1일 전" : `${diffDay}일 전`;
    if (diffHr >= 1) return diffHr === 1 ? "1시간 전" : `${diffHr}시간 전`;
    if (diffMin >= 1) return diffMin === 1 ? "1분 전" : `${diffMin}분 전`;
    return "방금 전";
  };

  return {
    // 상태
    memoryDetail,
    carouselData,
    comments,
    newComment,
    commentToDelete,
    menuOpen,
    deleteMemoryModalOpen,
    deleteCommentModalOpen,
    error,
    pageNumber,
    hasNext,
    isSpinning,
    currentIndex,
    // 함수
    handleAddComment,
    handleDeleteComment,
    handleDeleteMemory,
    toggleMenu,
    formatDate,
    lastCommentRef,
    setDeleteMemoryModalOpen,
    setDeleteCommentModalOpen,
    setCommentToDelete,
    setNewComment,
    handleScroll,
    nickname,
    observerRef, // 혹시나 UI에서 참고할 일 있으면 내보냄
  };
}
