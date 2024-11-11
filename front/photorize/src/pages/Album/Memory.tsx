import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import Header from "../../components/Common/Header";
import Footer from "../../components/Common/Footer";
import { useRecoilValue } from "recoil";
import { userData } from "../../recoil/userAtoms";
import { fetchReviews } from "../../api/MemoryAPI";
import { fetchMemory } from "../../api/MemoryAPI";
import { createComment } from "../../api/CommentAPI";

interface CarouselItem {
  // id: number;
  url: string;
  type: "PHOTO" | "VIDEO";
}

interface MemoryDetail {
  writerId: string;
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
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [carouselData, setCarouselData] = useState<CarouselItem[]>([]);
  const [memoryDetail, setMemoryDetail] = useState<MemoryDetail>();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const user = useRecoilValue(userData);

  useEffect(() => {
    const loadMemory = async () => {
      try {
        setLoading(true);
        if (id) {
          const response = await fetchMemory(Number(id));

          console.log(response);
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
        setLoading(false);
      }
    };

    loadMemory();
  }, [id]);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        setLoading(true);
        const data = await fetchReviews(0, Number(id));
        setComments(data.content || []);
      } catch (err) {
        setError("리뷰 데이터를 불러오는 중 오류가 발생했습니다.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, [id]);

  useEffect(() => {}, [comments]);

  const handleAddComment = async () => {
    if (newComment.trim() && id) {
      try {
        const commentResponse = await createComment(Number(id), newComment);
        const newCommentData: Comment = {
          commentId: commentResponse.commentId,
          writerImg: user.img || "/assets/default-profile.png",
          nickname: user.nickname || "익명",
          content: newComment,
          date: new Date().toISOString().split("T")[0],
          // date: new Date(commentResponse.createdAt).toISOString().split("T")[0],
        };

        console.log(commentResponse);

        setComments((prevComments) => [...prevComments, newCommentData]);
        setNewComment("");
      } catch (error) {
        console.error("댓글 등록 중 오류 발생:", error);
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

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleEditMemory = () => {
    navigate(`/memory/${id}`);
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="bg-[#F9F9F9] min-h-screen pt-14 pb-20">
      <Header title="추억 기록" />
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
                {/* 우측 상단 리스트 아이콘 */}
                <div className="absolute top-4 right-5">
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
                      <button
                        className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                        onClick={handleEditMemory}
                      >
                        추억 편집
                      </button>
                      <button className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100">
                        추억 삭제
                      </button>
                    </div>
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
            onChange={(e) => setNewComment(e.target.value)}
            className="border border-[#FFD2D2] rounded-full pl-4 pt-2 pb-2 pr-4 text-sm text-gray-500 focus:outline-none mb-2"
          />
          <button
            onClick={handleAddComment}
            className="bg-[#FF93A5] text-white rounded-full px-[20px] py-[6px] text-sm font-bold self-end"
          >
            등록
          </button>
        </div>

        {/* Comments Section */}
        <div className="p-3">
          {comments.map((comment) => (
            <div key={comment.commentId} className="flex items-start mb-4">
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
                <p className="text-[10px] text-[#A19791]">{comment.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Memory;
