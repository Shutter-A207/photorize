import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Common/Header";
import { loginUser } from "../../api/UserAPI";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const token = await loginUser({ email, password });
      if (token) {
        localStorage.setItem("token", token); // JWT 토큰 저장
        alert("로그인 성공");
        navigate("/home"); // 로그인 성공 후 홈 페이지로 이동
      } else {
        alert("로그인에 실패했습니다.");
      }
    } catch (error) {
      alert("로그인 중 오류가 발생했습니다.");
    }
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <img src="/assets/Logo1.png" alt="로고" className="w-[65%] mb-24" />
      <div className="w-[80%] max-w-md mx-auto">
        <div className="relative mb-3">
          <img
            src="/assets/LoginIcon.png"
            alt="아이디 아이콘"
            className="absolute left-[14px] top-1/2 transform -translate-y-1/2 w-6 h-6"
          />
          <input
            type="text"
            placeholder="아이디 입력"
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
        <button
          onClick={handleLogin}
          className="w-full h-[50px] font-bold text-[18px] p-3 mb-4 bg-[#FF93A5] text-white rounded-2xl"
        >
          로그인
        </button>
        <div
          className="text-center text-[#686E74] mb-8 underline"
          onClick={handleRegisterClick}
        >
          회원가입
        </div>
        <button className="relative mt-20 w-full h-[50px] font-bold text-[18px] p-3 bg-[#FEE500] rounded-2xl">
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
