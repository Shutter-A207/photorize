import React, { useState, useEffect } from "react";
import { getAllPoses, likePose, unlikePose } from "../../api/PoseAPI";
import Header from "../../components/Common/Header";
import Footer from "../../components/Common/Footer";

interface PoseData {
  poseId: number;
  img: string;
  headcount: string;
  likeCount: number;
  liked: boolean;
}

const Pose: React.FC = () => {
  const [selectedPeople, setSelectedPeople] = useState("");
  const [showLikedOnly, setShowLikedOnly] = useState(false);
  const [poseData, setPoseData] = useState<PoseData[]>([]);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState("");

  useEffect(() => {
    setPage(0);
    setPoseData([]);
    setHasMore(true);
    fetchPoses(0, convertPeopleToAPIFormat(selectedPeople));
  }, [selectedPeople]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 100 >=
          document.documentElement.scrollHeight &&
        !isLoading &&
        hasMore
      ) {
        fetchPoses(page, convertPeopleToAPIFormat(selectedPeople));
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoading, hasMore, page, selectedPeople]);

  const fetchPoses = async (page: number, people: string | undefined) => {
    setIsLoading(true);
    try {
      const response = await getAllPoses(page, people);
      const newPoses = response.data.content;
      setPoseData((prevData) => [...prevData, ...newPoses]);
      setHasMore(response.data.content.length > 0);
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error("포즈 데이터를 가져오는 중 오류 발생:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePeopleSelect = (people: string) => {
    setSelectedPeople(people === selectedPeople ? "" : people);
  };

  const handleToggleLiked = () => {
    setShowLikedOnly(!showLikedOnly);
  };

  const handleLikeToggle = async (poseId: number) => {
    const updatedPoseData = poseData.map((pose) => {
      if (pose.poseId === poseId) {
        return {
          ...pose,
          liked: !pose.liked,
          likeCount: pose.liked ? pose.likeCount - 1 : pose.likeCount + 1,
        };
      }
      return pose;
    });

    setPoseData(updatedPoseData);

    try {
      const pose = poseData.find((p) => p.poseId === poseId);
      if (pose?.liked) {
        await unlikePose(poseId);
      } else {
        await likePose(poseId);
      }
    } catch (error) {
      console.error("좋아요 상태 변경 중 오류 발생:", error);
      setPoseData(poseData);
    }
  };

  const openModal = (image: string) => {
    setModalImage(image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

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

  const filteredPoseData = poseData.filter((pose) =>
    showLikedOnly ? pose.liked : true
  );

  // 왼쪽 열과 오른쪽 열로 데이터 나누기
  const leftColumnImages = filteredPoseData.filter(
    (_, index) => index % 2 === 0
  );
  const rightColumnImages = filteredPoseData.filter(
    (_, index) => index % 2 !== 0
  );

  return (
    <>
      <Header title="포즈" />
      <div className="p-4 bg-[#F9F9F9] min-h-screen pt-[70px] pb-24">
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

        <div className="flex gap-4">
          <div className="flex flex-col gap-4 w-[48%]">
            {leftColumnImages.map((pose) => (
              <div key={pose.poseId} className="relative">
                <img
                  src={pose.img}
                  alt={`Pose ${pose.poseId}`}
                  className="w-full h-auto rounded-lg object-cover mb-1 cursor-pointer"
                  onClick={() => openModal(pose.img)}
                />
                <div className="flex items-center justify-end mt-1 text-gray-500">
                  <span className="text-[#818181] font-bold mr-2">
                    {pose.likeCount}
                  </span>
                  <button onClick={() => handleLikeToggle(pose.poseId)}>
                    <img
                      src={
                        pose.liked
                          ? "/assets/heartIcon2.png"
                          : "/assets/heartIcon1.png"
                      }
                      alt="heart icon"
                      className="w-[20px] h-[18px]"
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-4 w-[48%]">
            {rightColumnImages.map((pose) => (
              <div key={pose.poseId} className="relative">
                <img
                  src={pose.img}
                  alt={`Pose ${pose.poseId}`}
                  className="w-full h-auto rounded-lg object-cover mb-1 cursor-pointer"
                  onClick={() => openModal(pose.img)}
                />
                <div className="flex items-center justify-end mt-1 text-gray-500">
                  <span className="text-[#818181] font-bold mr-2">
                    {pose.likeCount}
                  </span>
                  <button onClick={() => handleLikeToggle(pose.poseId)}>
                    <img
                      src={
                        pose.liked
                          ? "/assets/heartIcon2.png"
                          : "/assets/heartIcon1.png"
                      }
                      alt="heart icon"
                      className="w-[20px] h-[18px]"
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {isModalOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={closeModal}
          >
            <div
              className="relative bg-white rounded-lg p-4"
              onClick={(e) => e.stopPropagation()}
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
