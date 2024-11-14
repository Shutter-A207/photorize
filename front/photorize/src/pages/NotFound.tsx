import React, { useEffect, useState } from "react";
import styles from './NotFound.module.css';

const NotFound: React.FC = () => {
  const [fallingPineapples, setFallingPineapples] = useState<number[]>([]);

  useEffect(() => {
    const generatePineapples = () => {
      const pineapples = Array.from({ length: 30 }, (_, i) => i);
      setFallingPineapples(pineapples);
    };

    generatePineapples();
  }, []);

  const getRandomImage = () => {
    const random = Math.random();
    return random <= 0.03 ? "/assets/hidden-hangyo.png" : "/assets/pineapple-icon.png";
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center relative overflow-hidden">
      {fallingPineapples.map((_, index) => (
        <img
          key={index}
          src={getRandomImage()}
          alt="Falling Pineapple"
          className={styles.fallingPineapple}
          style={{
            '--random-x': Math.random(),
            '--random-duration': `${Math.random() * 5 + 5}s`,
          } as React.CSSProperties}
        />
      ))}
      <img src="/assets/pineapple-icon.png" alt="로고" className={`w-[65%] mb-24 ${styles.rotate}`} />
      <div className="w-[80%] max-w-md mx-auto">
        <div className="text-center text-[24px] font-bold mb-8">
          잘못된 경로입니다.
        </div>
        <button
          className="w-full h-[50px] text-[18px] p-3 mb-4 bg-[#FF93A5] text-[#FFFFFF] rounded-2xl"
        >
          메인으로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default NotFound;
