import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Common/Header";
import Footer from "../components/Common/Footer";
import { getUserInfo } from "../api/UserAPI";

interface Memory {
  id: number;
  url: string;
  date: string;
  albumId: number;
  albumName: string;
}

interface UserProfile {
  memberId: number;
  nickname: string;
  img: string;
}

const Home = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userData = await getUserInfo();
        setUserProfile(userData);
      } catch (error) {
        console.error("유저 정보 가져오기 중 오류 발생:", error);
      }
    };

    const fetchedMemories = [
      {
        id: 1,
        url: "/assets/test/test2.jpg",
        date: "2023-01-01",
        albumId: 1,
        albumName: "Shutter",
      },
      {
        id: 2,
        url: "/assets/test/pose8.jpg",
        date: "2023-02-15",
        albumId: 2,
        albumName: "sooyeon의 앨범",
      },
      {
        id: 3,
        url: "/assets/test/pose1.jpg",
        date: "2023-03-10",
        albumId: 3,
        albumName: "욘두",
      },
    ];
    fetchUserProfile();
    setMemories(fetchedMemories);
  }, []);

  useEffect(() => {
    if (carouselRef.current) {
      const itemWidth = carouselRef.current.clientWidth;
      carouselRef.current.scrollTo({
        left: currentIndex * itemWidth,
        behavior: "smooth",
      });
    }
  }, [currentIndex]);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? memories.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === memories.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <>
      <Header title="" />
      <div className="bg-[#F9F9F9] min-h-screen pt-14 pb-24 overflow-hidden">
        {/* 상단 프로필 정보 */}
        <div className="flex items-center justify-between px-4 py-4">
          <div className="relative flex items-center">
            <div className="relative">
              <img
                src={userProfile?.img}
                alt="Profile"
                className="w-12 h-12 rounded-full"
              />
              <div className="absolute top-8 left-8 w-6 h-6 rounded-full">
                <img
                  src="/assets/cameraIcon.png"
                  alt="Camera Icon"
                  className="w-4 h-4"
                />
              </div>
            </div>
            <p className="ml-3 text-lg font-black text-[#343434]">
              {userProfile
                ? `${userProfile.nickname}님의 소중한 추억들`
                : "로딩 중..."}
            </p>
          </div>
          <img
            src="/assets/moonIcon.png"
            alt="Moon Icon"
            className="w-12 h-12 cursor-pointer"
            onClick={() => navigate("/home2")}
          />
        </div>

        {/* Snap Carousel */}
        <div className="flex justify-center items-center h-[calc(90vh-160px)] relative">
          {/* Previous Button */}
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-700 bg-opacity-50 text-white p-2 rounded-full z-10"
          >
            {"<"}
          </button>

          {/* Carousel Items */}
          <div
            ref={carouselRef}
            className="relative flex overflow-x-auto snap-x snap-mandatory w-full px-1"
          >
            {memories.map((memory, index) => (
              <div
                key={memory.id}
                className="snap-center w-full flex-shrink-0 flex justify-center items-center px-4"
                style={{ minWidth: "100%" }}
              >
                <div className="relative w-full max-w-lg">
                  <img
                    src={memory.url}
                    alt={`Memory ${memory.id}`}
                    className="w-full max-h-[70vh] object-contain rounded-lg shadow-lg"
                  />
                  {/* 왼쪽 아래 텍스트 */}
                  <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white p-2 rounded">
                    <p className="text-sm">{memory.date}</p>
                    <p className="text-lg font-semibold">#{memory.albumName}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-700 bg-opacity-50 text-white p-2 rounded-full z-10"
          >
            {">"}
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;
