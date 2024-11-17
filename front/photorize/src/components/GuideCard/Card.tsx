import React from 'react';
import { CardProps } from './Guide';

const Card: React.FC<CardProps> = ({ imgSrc, imgAlt, title, description }) => {
  return (
    <div className="flex flex-col items-center flex-grow">
      {/* 상단 배경과 이미지 */}
      <div className="w-full bg-[#FFC0CE] flex justify-center items-center p-10 rounded-t-2xl">
        <img src={imgSrc} alt={imgAlt} className="w-24 h-24 object-contain" />
      </div>

      {/* 카드 내용 */}
      <div className="p-6 text-center">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">{title}</h2>
        <p className="text-sm text-gray-600">
          {Array.isArray(description)
            ? description.map((line, index) => (
                <span key={index}>
                  {line}
                  <br />
                </span>
              ))
            : description}
        </p>
      </div>
    </div>
  );
};

export default Card;
