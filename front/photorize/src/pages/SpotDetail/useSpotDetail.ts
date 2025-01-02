import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchSpotMemories } from "../../api/SpotAPI";

export interface MemoryData {
  memoryId: number;
  fileUrl: string;
  albumName: string;
  date: string;
}

export function useSpotDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [memories, setMemories] = useState<MemoryData[]>([]);
  const [spotName, setSpotName] = useState<string>("");

  useEffect(() => {
    const loadMemories = async () => {
      if (!id) return;
      try {
        const response = await fetchSpotMemories(Number(id));
        setMemories(response.data.files);
        if (response.data.spotName) {
          setSpotName(response.data.spotName);
        }
      } catch (error) {
        console.error("지점 데이터를 불러오는 중 오류 발생:", error);
      }
    };
    loadMemories();
  }, [id]);

  const handleImageClick = (memoryId: number) => {
    navigate(`/memory/${memoryId}`);
  };

  // 왼/오른쪽 컬럼 나누기
  const leftColumnMemories = memories.filter((_, index) => index % 2 === 0);
  const rightColumnMemories = memories.filter((_, index) => index % 2 !== 0);

  return {
    spotName,
    leftColumnMemories,
    rightColumnMemories,
    handleImageClick,
  };
}
