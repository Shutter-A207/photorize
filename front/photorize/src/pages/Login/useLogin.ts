import { useState, KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, loginWithKakao } from "../../api/UserAPI";

export function useLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");    // 오류 메시지
  const [showCarousel, setShowCarousel] = useState(true); // 가이드 표시 여부

  // 이메일/비밀번호 로그인
  const handleLogin = async () => {
    setError("");
    try {
      const token = await loginUser({ email, password });
      if (token) {
        navigate("/home");
      } else {
        setError("이메일 또는 비밀번호가 일치하지 않습니다.");
      }
    } catch (e) {
      setError("이메일 또는 비밀번호가 일치하지 않습니다.");
    }
  };

  // 카카오 로그인
  const handleKakaoLogin = () => {
    loginWithKakao();
  };

  // 회원가입 페이지로 이동
  const handleRegisterClick = () => {
    navigate("/register");
  };

  // Enter 키 입력 시 로그인 시도
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  // 가이드 캐러셀 종료 시
  const handleCarouselFinish = () => {
    setShowCarousel(false);
  };

  return {
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
  };
}
