import React from 'react';
import CardCarousel from '../components/GuideCard/CardCarousel'; // 경로에 맞게 수정
import { guide } from '../components/GuideCard/Guide'; // 데이터를 가져옴

const GuidePage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <CardCarousel cards={guide} />
    </div>
  );
};

export default GuidePage;
