import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/Common/Header";
import Footer from "../../components/Common/Footer";
import { fetchSpotMemories } from "../../api/SpotAPI"; // API 함수 가져오기

interface MemoryData {
  memoryId: number;
  fileUrl: string;
  albumName: string;
  date: string;
}

const SpotDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [memories, setMemories] = useState<MemoryData[]>([]);
  const [spotName, setSpotName] = useState<string>(""); // SpotName 상태 추가

  useEffect(() => {
    const loadMemories = async () => {
      if (id) {
        try {
          const response = await fetchSpotMemories(Number(id));
          setMemories(response.data.files);
          if (response.data.spotName) {
            setSpotName(response.data.spotName);
          }
        } catch (error) {
          console.error(
            "추억 데이터를 불러오는 중 오류가 발생했습니다:",
            error
          );
        }
      }
    };

    loadMemories();
  }, [id]);

  const handleImageClick = (memoryId: number) => {
    navigate(`/memory/${memoryId}`);
  };

  // 왼쪽과 오른쪽 열에 데이터를 번갈아 배치
  const leftColumnMemories = memories.filter((_, index) => index % 2 === 0);
  const rightColumnMemories = memories.filter((_, index) => index % 2 !== 0);

  return (
    <div className="bg-[#F9F9F9] min-h-screen pt-14 pb-20">
      <Header title={spotName || "상세 정보"} /> {/* SpotName 표시 */}
      <div className="p-4">
        {/* 두 열로 나누어진 Masonry 스타일 레이아웃 */}
        <div className="flex gap-4">
          {/* 왼쪽 열 */}
          <div className="flex flex-col gap-4">
            {leftColumnMemories.map((memory) => (
              <div
                key={memory.memoryId}
                className="flex flex-col items-center"
                onClick={() => handleImageClick(memory.memoryId)}
              >
                <img
                  src={memory.fileUrl}
                  alt={`Memory ${memory.memoryId}`}
                  className="w-full h-auto rounded-lg object-cover mb-1"
                />
                <div className="flex items-center justify-between w-full text-xs text-gray-500">
                  <div className="flex items-center">
                    <span className="text-[#343434] text-[10px] font-bold">
                      {memory.albumName}
                    </span>
                  </div>
                  <span className="text-[#343434] text-[10px]">
                    {memory.date.slice(0, 10)}{" "}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* 오른쪽 열 */}
          <div className="flex flex-col gap-4">
            {rightColumnMemories.map((memory) => (
              <div
                key={memory.memoryId}
                className="flex flex-col items-center"
                onClick={() => handleImageClick(memory.memoryId)}
              >
                <img
                  src={memory.fileUrl}
                  alt={`Memory ${memory.memoryId}`}
                  className="w-full h-auto rounded-lg object-cover mb-1"
                />
                <div className="flex items-center justify-between w-full text-xs text-gray-500">
                  <div className="flex items-center">
                    <span className="text-[#343434] text-[10px] font-bold">
                      {memory.albumName}
                    </span>
                  </div>
                  <span className="text-[#343434] text-[10px]">
                    {memory.date.slice(0, 10)}{" "}
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
