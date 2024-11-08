import React from "react";
import Header from "../../components/Common/Header";
import Footer from "../../components/Common/Footer";
import KakaoMap from "../../components/KakaoMap";

const Spot = () => {
  return (
    <>
      <Header title="네컷 스팟" />
      <div className="bg-[#F9F9F9] min-h-screen flex flex-col">
        <div className="flex-grow">
          <KakaoMap />
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Spot;
