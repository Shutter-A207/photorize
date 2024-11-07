import React from "react";
import Header from "../../components/Common/Header";
import Footer from "../../components/Common/Footer";
import KakaoMap from "../../components/KakaoMap";
import { ToastProvider } from "../../components/Common/ToastProvider";

const Spot = () => {
  return (
    <>
      <Header title="네컷 스팟" />
      <div className="bg-[#F9F9F9] min-h-screen flex flex-col">
        <div className="flex-grow">
          <ToastProvider>
            <KakaoMap />
          </ToastProvider>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Spot;
