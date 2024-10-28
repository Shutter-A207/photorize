import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Loading = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 3초 후에 /login으로 이동
    const timer = setTimeout(() => {
      navigate("/login");
    }, 3000);

    // 컴포넌트 언마운트 시 타이머 정리
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-b from-custom-top to-custom-bottom">
      <img src="/assets/Logo2.png" alt="Logo" className="w-[65%]" />
      <div className="mt-4 mb-24 text-white text-xl font-bold">
        추억을 기록하다
      </div>
    </div>
  );
};

export default Loading;
