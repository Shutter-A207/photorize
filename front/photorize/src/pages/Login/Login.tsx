import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, loginWithKakao } from "../../api/UserAPI";
import { useToast } from "../../components/Common/ToastProvider";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // 오류 메시지 상태

  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleLogin = async () => {
    setError(""); // 로그인 시도 전에 오류 메시지 초기화
    try {
      const token = await loginUser({ email, password });
      if (token) {
        navigate("/home");
      } else {
        setError("이메일 또는 비밀번호가 일치하지 않습니다."); // 오류 메시지 설정
      }
    } catch (error) {
      setError("이메일 또는 비밀번호가 일치하지 않습니다.");
    }
  };

  const handleKakaoLogin = async () => {
    try {
      await loginWithKakao();
      showToast("카카오 로그인 성공!", "success");
      navigate("/home");
    } catch (error) {
      showToast("카카오 로그인에 실패했습니다.", "error");
    }
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center"
      onKeyDown={handleKeyDown}
    >
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
        {/* 오류 메시지 표시 */}
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
        <button className="relative mt-20 w-full h-[50px] font-bold text-[18px] p-3 bg-[#FEE500] rounded-2xl"
          onClick={handleKakaoLogin}>
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
