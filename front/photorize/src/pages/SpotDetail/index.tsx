import React from "react";
import Header from "../../components/Common/Header";
import Footer from "../../components/Common/Footer";
import SpotMemoryGrid from "./SpotMemoryGrid"; // default import
import { useSpotDetail } from "./useSpotDetail";

const SpotDetail: React.FC = () => {
  const {
    spotName,
    leftColumnMemories,
    rightColumnMemories,
    handleImageClick,
  } = useSpotDetail();

  return (
    <div className="bg-[#F9F9F9] min-h-screen pt-14 pb-20">
      <Header title={spotName || "상세 정보"} />
      <div className="p-4">
        <SpotMemoryGrid
          leftMemories={leftColumnMemories} 
          rightMemories={rightColumnMemories}
          onMemoryClick={handleImageClick}
        />
      </div>
      <Footer />
    </div>
  );
};

export default SpotDetail;
