import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import ReactPlayer from "react-player";
import Header from "../../components/Common/Header";
import Footer from "../../components/Common/Footer";
import { fetchReviews } from "../../api/MemoryAPI";
import { fetchMemory, deleteMemory } from "../../api/MemoryAPI";
import { createComment, deleteComment } from "../../api/CommentAPI";
import ConfirmationModal from "../../components/Common/ConfirmationModal";
import { useToast } from "../../components/Common/ToastProvider";
import { useLoading } from "../../components/Common/Loader/LoadingContext";
import Spinner from "../../components/Common/Loader/Spinner";

interface CarouselItem {
  // id: number;
  url: string;
  type: "PHOTO" | "VIDEO";
}

interface MemoryDetail {
  writerId: number;
  nickname: string;
  writerImg: string;
  date: string;
  spotName: string;
  content: string;
}

interface Comment {
  commentId: number;
  writerImg: string;
  nickname: string;
  content: string;
  date: string;
}

const Memory: React.FC = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const { albumId } = location.state || {};
  const [currentIndex, setCurrentIndex] = useState(0);
  const [carouselData, setCarouselData] = useState<CarouselItem[]>([]);
  const [memoryDetail, setMemoryDetail] = useState<MemoryDetail>();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteMemoryModalOpen, setDeleteMemoryModalOpen] = useState(false);
  const [deleteCommentModalOpen, setDeleteCommentModalOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const nickname = localStorage.getItem("nickname");
  const img = localStorage.getItem("img");
  const [pageNumber, setPageNumber] = useState(0);
  const [hasNext, setHasNext] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [isSpinning, setIsSpinnig] = useState(false);
  const { setIsLoading } = useLoading();

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
              response.files.map((file: { url: string; type: string }) => ({
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
  }, [id]);

  useEffect(() => {
    const loadReviews = async () => {
      if (!hasNext) return;

      try {
        const data = await fetchReviews(pageNumber, Number(id));
        setComments((prevComments) => [...prevComments, ...data.content]);
        setHasNext(data.hasNext);
      } catch (err) {
        console.error("리뷰 데이터를 불러오는 중 오류가 발생했습니다.", err);
      }
    };

    loadReviews();
  }, [pageNumber, hasNext, id]);

  useEffect(() => {}, [comments]);

  const lastCommentRef = useCallback(
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

  const handleAddComment = async () => {
    if (newComment.trim() && id) {
      try {
        setIsSpinnig(true);
        const commentResponse = await createComment(Number(id), newComment);
        const newCommentData: Comment = {
          commentId: commentResponse.commentId,
          writerImg: img || "/assets/default-profile.png",
          nickname: nickname || "익명",
          content: commentResponse.content,
          date: new Date(commentResponse.date)
            .toLocaleString("en-CA", { hour12: false })
            .slice(0, 19),
        };

        setComments((prevComments) => [newCommentData, ...prevComments]);
        setNewComment("");
      } catch (error) {
        console.error("댓글 등록 중 오류 발생:", error);
      } finally {
        setIsSpinnig(false);
      }
    }
  };

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

  const handleDeleteComment = async () => {
    if (commentToDelete !== null) {
      try {
        await deleteComment(commentToDelete);
        setComments((prev) =>
          prev.filter((comment) => comment.commentId !== commentToDelete)
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

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const scrollPosition = event.currentTarget.scrollLeft;
    const totalWidth = event.currentTarget.scrollWidth;
    const itemWidth = totalWidth / carouselData!.length;
    const newIndex = Math.round(scrollPosition / itemWidth);
    setCurrentIndex(newIndex);
  };

  const formatDate = (inputDate: string): string => {
    const date = new Date(inputDate);
    const now = new Date();
    const diffInMilliseconds = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInMonths / 12);

    if (diffInYears >= 1) {
      return diffInYears === 1 ? "1년 전" : `${diffInYears}년 전`;
    } else if (diffInMonths >= 1) {
      return diffInMonths === 1 ? "1개월 전" : `${diffInMonths}개월 전`;
    } else if (diffInDays >= 1) {
      return diffInDays === 1 ? "1일 전" : `${diffInDays}일 전`;
    } else if (diffInHours >= 1) {
      return diffInHours === 1 ? "1시간 전" : `${diffInHours}시간 전`;
    } else if (diffInMinutes >= 1) {
      return diffInMinutes === 1 ? "1분 전" : `${diffInMinutes}분 전`;
    } else {
      return "방금 전";
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // const handleEditMemory = () => {
  //   navigate(`/modify-memory/${id}`, { state: memoryDetail });
  // };

  // if (loading) {
  //   return <div>로딩 중...</div>;
  // }

  // if (error) {
  //   return <div>{error}</div>;
  // }

  return (
    <div className="bg-[#F9F9F9] min-h-screen pt-14 pb-20">
      <Header title="추억" />
      <div className="p-4">
        {/* Carousel */}
        <div
          className="carousel bg-white rounded-xl overflow-hidden mb-4 p-1"
          style={{
            boxShadow: "0px 2px 2px rgba(0, 0, 0, 0.25)",
          }}
        >
          <div
            className="flex overflow-x-auto snap-x snap-mandatory"
            onScroll={handleScroll}
          >
            {carouselData!.map((item) => (
              <div className="snap-center w-full flex-shrink-0">
                {/* <div key={item.id} className="snap-center w-full flex-shrink-0"> */}
                {item.type === "PHOTO" ? (
                  <img
                    src={item.url}
                    alt={`Carousel item`}
                    // alt={`Carousel item ${item.id}`}
                    className="w-full h-auto object-cover"
                  />
                ) : (
                  <ReactPlayer
                    url={item.url}
                    controls
                    width="100%"
                    height="auto"
                    className="rounded-lg"
                  />
                )}
              </div>
            ))}
          </div>
          {/* Carousel indicators */}
          <div className="flex justify-center py-3">
            {carouselData!.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full mx-2 ${
                  index === currentIndex ? "bg-[#FF93A5]" : "bg-gray-400"
                }`}
              ></div>
            ))}
          </div>
        </div>

        {/* Memory Record Details */}
        <div
          className="bg-white rounded-xl p-4 mb-4 relative"
          style={{ boxShadow: "0px 1px 1px rgba(0, 0, 0, 0.1)" }}
        >
          {memoryDetail && (
            <>
              <div className="flex items-center mb-2">
                <img
                  src={memoryDetail!.writerImg}
                  alt={memoryDetail!.nickname}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="ml-3 w-full">
                  <p className="font-bold text-[#343434]">
                    {memoryDetail?.nickname}
                  </p>
                  <div className="flex items-center justify-between font-bold text-xs text-[#A19791] w-full">
                    <div className="flex items-center">
                      <img
                        src="/assets/locationIcon2.png"
                        alt="location icon"
                        className="w-[9.6px] h-[12px] mr-1"
                      />
                      <span>{memoryDetail!.spotName}</span>
                    </div>
                    <span className="mr-1">{memoryDetail!.date}</span>
                  </div>
                </div>
                <div className="absolute top-4 right-5">
                  {nickname === memoryDetail?.nickname && (
                    <>
                      <img
                        src="/assets/listIcon.png"
                        className="w-5 cursor-pointer"
                        onClick={toggleMenu}
                      />
                      {menuOpen && (
                        <div
                          ref={menuRef}
                          className="absolute right-0 mt-2 bg-white shadow-lg rounded-md w-32"
                        >
                          {/* <button
                            className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                            onClick={handleEditMemory}
                          >
                            추억 편집
                          </button> */}
                          <button
                            className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                            onClick={() => setDeleteMemoryModalOpen(true)} // 모달 열기
                          >
                            추억 삭제
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
              <div className="border-t border-gray-200 mt-3 mb-4"></div>
              <p className="text-sm font-medium text-[#343434] p-2">
                {memoryDetail!.content}
              </p>
            </>
          )}
        </div>

        <div className="border-t border-gray-200 mt-6 mb-2"></div>

        {/* 댓글 작성 부분 */}
        <div className="flex flex-col mt-4">
          <input
            type="text"
            placeholder="댓글 작성"
            value={newComment}
            onChange={(e) => {
              if (e.target.value.length <= 100) {
                setNewComment(e.target.value);
              }
            }}
            className="border border-[#FFD2D2] rounded-full pl-4 py-2 text-sm text-gray-500 focus:outline-none mb-2"
          />
          {/* 글자 수 표시와 등록 버튼 */}
          <div className="flex items-center justify-end">
            <div
              className={`text-xs font-bold mr-2 ${
                newComment.length <= 0 || newComment.length > 100
                  ? "text-red-500"
                  : "text-gray-500"
              }`}
            >
              {newComment.length}/100
            </div>
            <button
              onClick={handleAddComment}
              className={`rounded-full px-4 py-2 text-white text-sm font-bold ${
                isSpinning ||
                newComment.trim().length < 1 ||
                newComment.length > 100
                  ? "bg-[#CCCCCC]"
                  : "bg-[#FF93A5]"
              }`}
              disabled={
                isSpinning ||
                newComment.trim().length < 1 ||
                newComment.length > 100
              }
            >
              {isSpinning ? <Spinner /> : "등록"}
            </button>
          </div>
        </div>

        {/* Comments Section */}
        <div className="p-3">
          {comments.map((comment, index) => {
            const isLastComment = index === comments.length - 1;
            return (
              <div
                key={comment.commentId}
                ref={isLastComment ? lastCommentRef : null}
                className="flex items-start mb-4"
              >
                <img
                  src={comment.writerImg}
                  alt={comment.nickname}
                  className="w-12 h-12 rounded-full object-cover mr-3 mt-3"
                />
                <div>
                  <p className="text-sm font-bold text-[#343434] mb-1">
                    {comment.nickname}
                  </p>
                  <div
                    className="bg-[#FFFFFF] border border-[#FFD2D2] rounded-xl p-2 mb-[1px]"
                    style={{ borderRadius: "5px 15px 15px 15px" }}
                  >
                    <p className="text-sm text-[#343434]">{comment.content}</p>
                  </div>
                  <div className="flex">
                    <p className="text-[10px] text-[#A19791] mr-2">
                      {formatDate(comment.date)}
                    </p>
                    {comment.nickname === nickname && (
                      <button
                        onClick={() => {
                          setCommentToDelete(comment.commentId);
                          setDeleteCommentModalOpen(true);
                        }}
                        className="text-red-500 text-[10px]"
                      >
                        삭제
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {deleteMemoryModalOpen && (
        <ConfirmationModal
          message="정말로 이 추억을 삭제하시겠습니까?"
          onConfirm={handleDeleteMemory}
          onCancel={() => setDeleteMemoryModalOpen(false)}
        />
      )}
      {deleteCommentModalOpen && (
        <ConfirmationModal
          message="정말로 이 댓글을 삭제하시겠습니까?"
          onConfirm={handleDeleteComment}
          onCancel={() => setDeleteCommentModalOpen(false)}
        />
      )}
      <Footer />
    </div>
  );
};

export default Memory;
