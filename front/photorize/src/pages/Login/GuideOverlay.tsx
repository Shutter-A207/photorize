// pages/Login/GuideOverlay.tsx
import React from "react";
import CardCarousel from "../../components/GuideCard/CardCarousel";
import { guide } from "../../components/GuideCard/Guide";

interface GuideOverlayProps {
  onFinish: () => void;
}

const GuideOverlay: React.FC<GuideOverlayProps> = ({ onFinish }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
      <CardCarousel cards={guide} onFinish={onFinish} />
    </div>
  );
};

export default GuideOverlay;
