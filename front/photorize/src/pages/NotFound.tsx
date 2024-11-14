import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from './NotFound.module.css';

const NotFound: React.FC = () => {
  const [fallingPineapples, setFallingPineapples] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const generatePineapples = () => {
      const pineapples = Array.from({ length: 30 }, (_, i) => i);
      setFallingPineapples(pineapples);
    };

    generatePineapples();
  }, []);

  const getRandomImage = () => {
    const random = Math.random();
    return random <= 0.05 ? "/assets/hidden-hangyo.png" : "/assets/pineapple-icon.png";
  };

  const handleImageClick = (src: string) => {
    if (src === "/assets/hidden-hangyo.png") {
      setIsModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center relative overflow-hidden">
      {fallingPineapples.map((_, index) => {
        const imgSrc = getRandomImage();
        return (
          <img
            key={index}
            src={imgSrc}
            alt="Falling Pineapple"
            className={styles.fallingPineapple}
            style={{
              '--random-x': Math.random(),
              '--random-duration': `${Math.random() * 5 + 5}s`,
            } as React.CSSProperties}
            onClick={() => handleImageClick(imgSrc)}
          />
        );
      })}
      <img src="/assets/pineapple-icon.png" alt="로고" className={`w-[65%] mb-24 ${styles.rotate}`} />
      <div className="w-[80%] max-w-md mx-auto">
        <div className="text-center text-[24px] font-bold mb-8">
          잘못된 경로입니다.
        </div>
        <button
          className="w-full h-[50px] text-[18px] p-3 mb-4 bg-[#FF93A5] text-[#FFFFFF] rounded-2xl"
          onClick={() => navigate('/home')}
        >
          메인으로 돌아가기
        </button>
      </div>

      {/* 모달 */}
      {isModalOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center relative">
          <button
            className="absolute top-2 right-2 mr-2 text-gray-500 hover:text-gray-800"
            onClick={() => setIsModalOpen(false)} // 모달 닫기
            aria-label="Close Modal"
          >
            ✖
          </button>
          <h2 className="text-2xl font-bold mb-4">당신도 한교동을 좋아하시나요?</h2>
          <p>저희 Shutter팀은 한교동을 매우 좋아합니다!</p>
          <p>파인애플 피자도요! 🍕</p>
        </div>
      </div>
    )}
    </div>
  );
};

export default NotFound;
