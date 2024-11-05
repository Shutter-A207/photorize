import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/Common/Header";
import Footer from "../../components/Common/Footer";

interface ImageData {
  id: number;
  src: string;
  location: string;
  date: string;
}

const imageData: ImageData[] = [
  {
    id: 1,
    src: "/assets/test/test2.jpg",
    location: "인생네컷 강남점",
    date: "2024-10-18",
  },
  {
    id: 2,
    src: "/assets/test/test1.png",
    location: "인생네컷 강남점",
    date: "2024-10-15",
  },
  {
    id: 3,
    src: "/assets/test/test3.jpg",
    location: "인생네컷 홍대입구점",
    date: "2024-10-12",
  },
];

const SpotDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // 열을 나누어 각각의 열에 이미지 할당
  const leftColumnImages = imageData.filter((_, index) => index % 2 === 0);
  const rightColumnImages = imageData.filter((_, index) => index % 2 !== 0);

  const handleImageClick = (imageId: number) => {
    navigate(`/memory/${imageId}`);
  };

  return (
    <div className="bg-[#F9F9F9] min-h-screen pt-14 pb-20">
      <Header title="인생네컷 강남 1호점" />
      <div className="p-4">
        {/* 두 열로 나누어진 Masonry 스타일 레이아웃 */}
        <div className="flex gap-4">
          {/* 왼쪽 열 */}
          <div className="flex flex-col gap-4">
            {leftColumnImages.map((image) => (
              <div
                key={image.id}
                className="flex flex-col items-center"
                onClick={() => handleImageClick(image.id)}
              >
                <img
                  src={image.src}
                  alt={`Album ${image.id}`}
                  className="w-[154px] h-auto rounded-lg object-cover mb-1"
                />
                <div className="flex items-center justify-between w-full text-xs text-gray-500">
                  <div className="flex items-center">
                    <img
                      src="/assets/locationIcon.png"
                      alt="location icon"
                      className="w-2 h-3 mr-1"
                    />
                    <span className="text-[#343434] text-[10px] font-bold">
                      {image.location}
                    </span>
                  </div>
                  <span className="text-[#343434] text-[10px]">
                    {image.date}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* 오른쪽 열 */}
          <div className="flex flex-col gap-4">
            {rightColumnImages.map((image) => (
              <div
                key={image.id}
                className="flex flex-col items-center"
                onClick={() => handleImageClick(image.id)}
              >
                <img
                  src={image.src}
                  alt={`Album ${image.id}`}
                  className="w-[154px] h-auto rounded-lg object-cover mb-1"
                />
                <div className="flex items-center justify-between w-full text-xs text-gray-500">
                  <div className="flex items-center">
                    <img
                      src="/assets/locationIcon.png"
                      alt="location icon"
                      className="w-2 h-3 mr-1"
                    />
                    <span className="text-[#343434] text-[10px] font-bold">
                      {image.location}
                    </span>
                  </div>
                  <span className="text-[#343434] text-[10px]">
                    {image.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SpotDetail;