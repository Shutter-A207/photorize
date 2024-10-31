import React, { useState } from "react";
import Header from "../../components/Common/Header";
import Footer from "../../components/Common/Footer";

const Pose = () => {
  const [selectedPeople, setSelectedPeople] = useState("2인");
  const [showLikedOnly, setShowLikedOnly] = useState(false);
  const [poseData, setPoseData] = useState([
    { id: 1, image: "/assets/test/pose1.jpg", likes: 89, liked: false },
    { id: 2, image: "/assets/test/pose2.jpg", likes: 52, liked: true },
    { id: 3, image: "/assets/test/pose3.jpg", likes: 31, liked: false },
    { id: 4, image: "/assets/test/pose4.jpg", likes: 17, liked: true },
    { id: 5, image: "/assets/test/pose5.jpg", likes: 5, liked: false },
    { id: 6, image: "/assets/test/pose6.jpg", likes: 2, liked: true },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState("");

  const handlePeopleSelect = (people: string) => {
    setSelectedPeople(people);
  };

  const handleToggleLiked = () => {
    setShowLikedOnly(!showLikedOnly);
  };

  const handleLikeToggle = (id: number) => {
    setPoseData((prevPoseData) =>
      prevPoseData.map((pose) =>
        pose.id === id
          ? {
              ...pose,
              liked: !pose.liked,
              likes: pose.liked ? pose.likes - 1 : pose.likes + 1,
            }
          : pose
      )
    );
  };

  const openModal = (image: string) => {
    setModalImage(image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const filteredPoseData = showLikedOnly
    ? poseData.filter((pose) => pose.liked)
    : poseData;

  return (
    <>
      <Header title="포즈" />
      <div className="p-4 bg-[#F9F9F9] min-h-screen pt-[70px] pb-24">
        {/* 인원수 선택 버튼 */}
        <div className="flex flex-col justify-between mb-4">
          <div className="flex space-x-2">
            {["1인", "2인", "3~4인", "5인 이상"].map((people) => (
              <button
                key={people}
                onClick={() => handlePeopleSelect(people)}
                className={`px-4 py-1 rounded-full font-bold ${
                  selectedPeople === people
                    ? "bg-[#FF93A5] text-white"
                    : "border border-[#FF93A5] bg-white text-[#FF93A5]"
                }`}
              >
                {people}
              </button>
            ))}
          </div>

          {/* 좋아요 필터 토글 */}
          <div className="flex justify-end items-center space-x-2 mt-3">
            <span className="text-[#818181] font-bold text-sm">
              내가 좋아요 한 사진
            </span>
            <label className="relative inline-block w-11 h-6">
              <input
                type="checkbox"
                checked={showLikedOnly}
                onChange={handleToggleLiked}
                className="opacity-0 w-0 h-0"
              />
              <span
                className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition duration-200 ${
                  showLikedOnly ? "bg-[#FF93A5]" : "bg-gray-300"
                }`}
              ></span>
              <span
                className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 transform ${
                  showLikedOnly ? "translate-x-5" : ""
                }`}
              ></span>
            </label>
          </div>
        </div>

        {/* 이미지 Masonry 레이아웃 */}
        <div className="grid grid-cols-2 gap-4">
          {filteredPoseData.map((pose) => (
            <div key={pose.id} className="relative">
              <img
                src={pose.image}
                alt={`Pose ${pose.id}`}
                className="w-full h-auto rounded-lg object-cover mb-1 cursor-pointer"
                onClick={() => openModal(pose.image)}
              />
              <div className="flex items-center justify-end mt-1 text-gray-500">
                <span className="text-[#818181] font-bold mr-2">
                  {pose.likes}
                </span>
                <button onClick={() => handleLikeToggle(pose.id)}>
                  <img
                    src={
                      pose.liked
                        ? "/assets/heartIcon2.png" // 좋아요 한 하트
                        : "/assets/heartIcon1.png" // 빈 하트
                    }
                    alt="heart icon"
                    className="w-[20px] h-[18px]"
                  />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 모달 컴포넌트 */}
        {isModalOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={closeModal} // 바깥 영역 클릭 시 모달 닫힘
          >
            <div
              className="relative bg-white rounded-lg p-4"
              onClick={(e) => e.stopPropagation()} // 내부 클릭 시 이벤트 전파 방지
            >
              <img
                src={modalImage}
                alt="Enlarged Pose"
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Pose;
