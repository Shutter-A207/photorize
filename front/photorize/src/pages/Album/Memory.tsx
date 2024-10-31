import React, { useState } from "react";
import ReactPlayer from "react-player";
import Header from "../../components/Common/Header";
import Footer from "../../components/Common/Footer";

interface CarouselItem {
  id: number;
  src: string;
  type: "image" | "video";
}

interface Comment {
  id: number;
  profile: string;
  name: string;
  content: string;
  date: string;
}

interface MemoryDetail {
  profile: string;
  name: string;
  location: string;
  date: string;
  memo: string;
}

const carouselData: CarouselItem[] = [
  { id: 1, src: "/assets/test/test2.jpg", type: "image" },
  { id: 2, src: "/videos/movie1.mp4", type: "video" },
];

const memoryDetail: MemoryDetail = {
  profile: "/assets/test/member1.png",
  name: "조수연",
  location: "인생네컷 역삼점",
  date: "2024-10-12",
  memo: "팀원들과 친해질 수 있었던 Field Trip 너무너무 재미있었다 ~~",
};

const initialComments: Comment[] = [
  {
    id: 1,
    profile: "/assets/test/member1.png",
    name: "최은혜",
    content: "다음에도 또 놀러가자!!!",
    date: "2024-10-13 12:11:39",
  },
  {
    id: 2,
    profile: "/assets/test/member1.png",
    name: "이규빈",
    content: "좋아~ 너무 재밌었다!! 진짜 ㅎㅎ 굿굿~!",
    date: "2024-10-13 12:12:39",
  },
];

const Memory: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const scrollPosition = event.currentTarget.scrollLeft;
    const totalWidth = event.currentTarget.scrollWidth;
    const itemWidth = totalWidth / carouselData.length;
    const newIndex = Math.round(scrollPosition / itemWidth);
    setCurrentIndex(newIndex);
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const newCommentData: Comment = {
        id: comments.length + 1,
        profile: "/assets/test/member1.png",
        name: "조수연",
        content: newComment,
        date: new Date().toLocaleString(),
      };
      setComments([...comments, newCommentData]);
      setNewComment("");
    }
  };

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
            {carouselData.map((item, index) => (
              <div key={item.id} className="snap-center w-full flex-shrink-0">
                {item.type === "image" ? (
                  <img
                    src={item.src}
                    alt={`Carousel item ${item.id}`}
                    className="w-full h-auto object-cover"
                  />
                ) : (
                  <ReactPlayer
                    url={item.src}
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
            {carouselData.map((_, index) => (
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
          className="bg-white rounded-xl p-4 mb-4"
          style={{
            boxShadow: "0px 1px 1px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div className="flex items-center mb-2">
            <img
              src={memoryDetail.profile}
              alt={memoryDetail.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="ml-3 w-full">
              <p className="font-bold text-[#343434]">{memoryDetail.name}</p>
              <div className="flex items-center justify-between font-bold text-xs text-[#A19791] w-full">
                <div className="flex items-center">
                  <img
                    src="/assets/locationIcon2.png"
                    alt="location icon"
                    className="w-[9.6px] h-[12px] mr-1"
                  />
                  <span>{memoryDetail.location}</span>
                </div>
                <span className="mr-1">{memoryDetail.date}</span>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-3 mb-4"></div>

          <p className="text-sm font-medium text-[#343434] p-2">
            {memoryDetail.memo}
          </p>
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
            <div key={comment.id} className="flex items-start mb-4">
              <img
                src={comment.profile}
                alt={comment.name}
                className="w-12 h-12 rounded-full object-cover mr-3 mt-3"
              />
              <div>
                <p className="text-sm font-bold text-[#343434] mb-1">
                  {comment.name}
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
