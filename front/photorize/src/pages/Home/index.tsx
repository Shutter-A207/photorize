import React, { useState } from "react";
import Header from "../../components/Common/Header";
import Footer from "../../components/Common/Footer";
import EditNicknameModal from "../../components/EditNicknameModal";
import EditProfileModal from "../../components/EditProfileModal";
import HomeCarousel from "./HomeCarousel";
import ProfileMenu from "./ProfileMenu";
import { useHome } from "./useHome";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const {
    userProfile,
    setUserProfile,
    memories,
    emblaRef,
    handlePrev,
    handleNext,
    menuOpen,
    toggleMenu,
    menuRef,
    handleLogout,
  } = useHome();
  const navigate = useNavigate();

  // 모달 상태
  const [isEditNicknameModalOpen, setIsEditNicknameModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);

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

  // 캐러셀에서 사진 클릭 시 메모리 상세 페이지 이동
  const handleMemoryClick = (memoryId: number) => {
    navigate(`/memory/${memoryId}`);
  };

  return (
    <>
      <Header title="" />

      <div className="bg-[#F9F9F9] min-h-screen pt-11 pb-24 overflow-hidden">
        {/* 상단 프로필 & 메뉴 */}
        <div className="flex items-center justify-between px-4 py-4 my-2">
          <div className="relative flex items-center">
            {/* 프로필 이미지 + 메뉴 아이콘 */}
            <div className="relative cursor-pointer" onClick={toggleMenu}>
              <div className="w-12 h-12 rounded-full overflow-hidden">
                {userProfile?.img && (
                  <img
                    src={userProfile.img}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="absolute top-8 left-8 w-6 h-6 bg-[#F2F2F2] rounded-full flex items-center justify-center">
                <img
                  src="/assets/listIcon2.png"
                  alt="List Icon"
                  className="w-4 mr-0.5"
                />
              </div>
            </div>

            {/* 닉네임 */}
            <p className="ml-3 text-lg font-black text-gray-600 flex items-center">
              {userProfile
                ? `${userProfile.nickname}님의 소중한 추억들`
                : "로딩 중..."}
            </p>

            <ProfileMenu
              menuOpen={menuOpen}
              menuRef={menuRef}
              onCloseMenu={() => toggleMenu()}
              onEditProfile={() => setIsEditProfileModalOpen(true)}
              onEditNickname={() => setIsEditNicknameModalOpen(true)}
              onLogout={handleLogout}
            />
          </div>

          {/* Moon Icon */}
          <img
            src="/assets/moonIcon.png"
            alt="Moon Icon"
            className="w-12 h-12 cursor-pointer"
            onClick={() => navigate("/home2")}
          />
        </div>

        {/* 메모리 캐러셀 영역 */}
        {memories.length > 0 ? (
          <HomeCarousel
            memories={memories}
            emblaRef={emblaRef}
            handlePrev={handlePrev}
            handleNext={handleNext}
            onMemoryClick={handleMemoryClick}
          />
        ) : (
          // 메모리가 없을 때 보여줄 영역
          <div className="flex justify-center items-center h-[calc(90vh-160px)]">
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
          </div>
        )}
      </div>

      <Footer />

      {/* 모달들 */}
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
