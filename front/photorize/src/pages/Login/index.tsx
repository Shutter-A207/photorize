import React from "react";
import GuideOverlay from "./GuideOverlay";
import { useLogin } from "./useLogin";

const Login: React.FC = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    error,
    handleLogin,
    handleKakaoLogin,
    handleRegisterClick,
    handleKeyDown,
    showCarousel,
    handleCarouselFinish,
  } = useLogin();

  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center relative"
      onKeyDown={handleKeyDown}
    >
      {showCarousel && (
        <GuideOverlay onFinish={handleCarouselFinish} />
      )}

      <img src="/assets/Logo1.png" alt="로고" className="w-[65%] mb-24" />

      <div className="w-[80%] max-w-md mx-auto">
        <div className="relative mb-3">
          <img
            src="/assets/LoginIcon.png"
            alt="로그인 아이콘"
            className="absolute left-[14px] top-1/2 transform -translate-y-1/2 w-6 h-6"
          />
          <input
            type="text"
            placeholder="이메일 입력"
            className="w-full h-[56px] pl-12 pr-3 py-3 text-[14px] border border-gray-400 rounded-2xl placeholder-[#BCBFC3] focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="relative mb-3">
          <img
            src="/assets/PasswordIcon.png"
            alt="비밀번호 아이콘"
            className="absolute left-[16px] top-1/2 transform -translate-y-1/2 w-5 h-6"
          />
          <input
            type="password"
            placeholder="영문자, 숫자, 특수문자 혼용(8~15자)"
            className="w-full h-[56px] pl-12 pr-3 py-3 text-[14px] border border-gray-400 rounded-2xl placeholder-[#BCBFC3] focus:outline-none"
            style={{ color: "#000" }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && (
          <p className="text-red-400 font-bold text-sm mb-3 text-center">
            {error}
          </p>
        )}

        <button
          onClick={handleLogin}
          className="w-full h-[50px] font-bold text-[18px] p-3 mb-4 bg-[#FF93A5] text-white rounded-2xl"
        >
          로그인
        </button>

        <div
          className="text-center text-[#686E74] mb-8 underline cursor-pointer"
          onClick={handleRegisterClick}
        >
          회원가입
        </div>

        <button
          className="relative mt-20 w-full h-[50px] font-bold text-[18px] p-3 bg-[#FEE500] rounded-2xl"
          onClick={handleKakaoLogin}
        >
          <img
            src="/assets/KakaoIcon.png"
            alt="카카오 아이콘"
            className="absolute left-[18px] top-1/2 transform -translate-y-1/2 w-7 h-6"
          />
          카카오로 로그인 하기
        </button>
      </div>
    </div>
  );
};

export default Login;
