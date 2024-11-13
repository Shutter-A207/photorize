import React from "react";
import styles from './NotFound.module.css';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <img src="/assets/pineapple-icon.png" alt="로고" className={`w-[65%] mb-24 ${styles.rotate}`}  />
      <div className="w-[80%] max-w-md mx-auto">

        <div
          className="text-center text-[24px] text-[#686E74] mb-8 underline"
        >
          잘못된 경로입니다.
        </div>
        <button
          className="w-full h-[50px] font-bold text-[18px] p-3 mb-4 bg-[#FF93A5] text-white rounded-2xl"
        >
          메인으로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default NotFound;
