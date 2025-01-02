import React, { useState, useEffect, useRef, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Common/Header";
import Footer from "../../components/Common/Footer";
import { getUserInfo, deleteFcmToken } from "../../api/UserAPI";
import { fetchMainPageMemories } from "../../api/MemoryAPI";
import EditNicknameModal from "../../components/EditNicknameModal";
import EditProfileModal from "../../components/EditProfileModal";
import { useLoading } from "../../components/Common/Loader/LoadingContext";

interface Memory {
  memoryId: number;
  url: string;
  date: string;
  albumId: number;
  albumName: string;
}

interface UserProfile {
  nickname: string;
  img: string;
}

const Home = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditNicknameModalOpen, setIsEditNicknameModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const { setIsLoading } = useLoading();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const userData = await getUserInfo();
        localStorage.setItem("nickname", userData.nickname);
        localStorage.setItem("img", userData.img);
        setUserProfile(userData);

        const memoryData = await fetchMainPageMemories();
        setMemories(memoryData.data);
      } catch (error) {
        console.error("데이터 로드 중 오류 발생:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  );
  const handleNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  );

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const handleNicknameChange = (newNickname: string) => {
    if (userProfile) {
      setUserProfile({ ...userProfile, nickname: newNickname });
    }
  };

  const handleProfileUpdate = (newProfileImg: string) => {
    if (userProfile) {
      setUserProfile({ ...userProfile, img: newProfileImg });
    }
  };

  const handleLogout = async () => {
    try {
      await deleteFcmToken();
      localStorage.removeItem("photorize-token");
      navigate("/login");
    } catch (error) {
      console.error("로그아웃 중 오류 발생:", error);
    }
  };

  return (
    <>
      <Header title="" />
      <div className="bg-[#F9F9F9] min-h-screen pt-11 pb-24 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-4 my-2">
          <div className="relative flex items-center">
            <div className="relative cursor-pointer" onClick={toggleMenu}>
              <div className="w-12 h-12 rounded-full overflow-hidden">
                <img
                  src={userProfile?.img}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute top-8 left-8 w-6 h-6 bg-[#F2F2F2] rounded-full flex items-center justify-center">
                <img
                  src="/assets/listIcon2.png"
                  alt="List Icon"
                  className="w-4 mr-0.5"
                />
              </div>
            </div>
            <p className="ml-3 text-lg font-black text-gray-600 flex items-center">
              {userProfile
                ? `${userProfile.nickname}님의 소중한 추억들`
                : "로딩 중..."}
            </p>
            {menuOpen && (
              <div
                ref={menuRef}
                className="absolute top-11 left-0 bg-white shadow-lg rounded-md w-32 z-10 mt-2"
              >
                <button
                  className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                  onClick={() => setIsEditProfileModalOpen(true)}
                >
                  프로필 수정
                </button>
                <button
                  className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                  onClick={() => {
                    setIsEditNicknameModalOpen(true);
                    setMenuOpen(false);
                  }}
                >
                  닉네임 수정
                </button>
                <button
                  className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                  onClick={handleLogout}
                >
                  로그아웃
                </button>
              </div>
            )}
          </div>
          <img
            src="/assets/moonIcon.png"
            alt="Moon Icon"
            className="w-12 h-12 cursor-pointer"
            onClick={() => navigate("/home2")}
          />
        </div>

        <div className="flex justify-center items-center h-[calc(90vh-160px)] relative">
          {memories.length > 0 ? (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-700 bg-opacity-50 text-white p-2 rounded-full z-10"
              >
                {"<"}
              </button>

              <div className="embla" ref={emblaRef}>
                <div className="embla__container flex">
                  {memories.map((memory) => (
                    <div
                      className="embla__slide flex-shrink-0 w-full max-w-lg flex justify-center items-center px-4"
                      key={memory.memoryId}
                    >
                      <div
                        className="relative w-full flex justify-center items-center"
                        onClick={() => navigate(`/memory/${memory.memoryId}`)}
                      >
                        <img
                          src={memory.url}
                          alt={`Memory ${memory.memoryId}`}
                          className="w-full max-h-[70vh] object-contain rounded-lg"
                        />
                        <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white p-2 rounded">
                          <p className="text-sm">{memory.date.split(" ")[0]}</p>
                          <p className="text-lg font-semibold">
                            #{memory.albumName}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-700 bg-opacity-50 text-white p-2 rounded-full z-10"
              >
                {">"}
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center bg-white p-6 rounded-lg shadow-md w-11/12 max-w-4xl aspect-[3/1] mx-4">
              <h2 className="text-xl font-semi-bold text-gray-700 mb-4">
                아직 추억이 없네요!
              </h2>
              <img
                src="/assets/no-memories-main.png"
                alt="No memories available"
                className="w-36 h-36 mb-6"
              />
              <p className="text-gray-500 text-sm mb-6 text-center leading-relaxed">
                새로운 추억을 만들어보세요.
                <br />
                사진을 업로드하면 이곳에서 확인할 수 있어요.
              </p>
              <button
                className="bg-[#FF93A5] text-white px-6 py-3 rounded-2xl text-base font-semibold transition-all"
                onClick={() => navigate("/record")}
              >
                사진 업로드하기
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />

      <EditProfileModal
        isOpen={isEditProfileModalOpen}
        onClose={() => setIsEditProfileModalOpen(false)}
        currentProfileImg={userProfile?.img || ""}
        onProfileUpdate={handleProfileUpdate}
      />

      <EditNicknameModal
        isOpen={isEditNicknameModalOpen}
        onClose={() => setIsEditNicknameModalOpen(false)}
        currentNickname={userProfile?.nickname || ""}
        onNicknameChange={handleNicknameChange}
      />
    </>
  );
};

export default Home;
