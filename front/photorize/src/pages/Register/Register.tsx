import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Common/Header";
import {
  registerUser,
  generateAuthCode,
  verifyAuthCode,
  checkNicknameAvailability,
} from "../../api/UserAPI";

const Register = () => {
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [isNicknameAvailable, setIsNicknameAvailable] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [emailMessage, setEmailMessage] = useState("");
  const [verificationMessage, setVerificationMessage] = useState("");
  const [nicknameMessage, setNicknameMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordCheckMessage, setPasswordCheckMessage] = useState("");
  const navigate = useNavigate();
  const [isFormValid, setIsFormValid] = useState(false);

  // 이메일 정규식 유효성 검사
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,50}$/;
    return emailRegex.test(email);
  };

  // 비밀번호 정규식 유효성 검사
  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&()_\-+=]).{8,20}$/;
    return passwordRegex.test(password);
  };

  // 닉네임 정규식 유효성 검사 (2~8자)
  const validateNickname = (nickname) => {
    const nicknameRegex = /^[a-zA-Z0-9가-힣]{2,8}$/;
    return nicknameRegex.test(nickname);
  };

  useEffect(() => {
    const isValid =
      validateEmail(email) &&
      isCodeVerified &&
      validateNickname(nickname) &&
      isNicknameAvailable &&
      validatePassword(password) &&
      password === passwordCheck;
    setIsFormValid(isValid);
  }, [
    email,
    isCodeVerified,
    nickname,
    isNicknameAvailable,
    password,
    passwordCheck,
  ]);

  // 타이머가 작동 중일 때 매 초마다 감소
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0 && interval) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // 인증번호 생성 요청 및 타이머 시작
  const handleSendCode = async () => {
    setVerificationCode("");
    if (!validateEmail(email)) {
      setEmailMessage("유효하지 않은 이메일입니다.");
      return;
    }
    try {
      const response = await generateAuthCode({ email, authType: "SIGNUP" });
      if (response) {
        setEmailMessage("인증번호가 전송되었습니다.");
        setTimer(300); // 타이머 5분(300초) 설정
        setIsCodeSent(true);
      }
    } catch (error) {
      setEmailMessage("사용 중인 이메일입니다.");
    }
  };

  // 타이머 표시 형식 변환 함수 (분:초)
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // 인증번호 검증 요청
  const handleVerifyCode = async () => {
    try {
      const response = await verifyAuthCode({
        email,
        authCode: verificationCode,
        authType: "SIGNUP",
      });
      if (response) {
        setIsCodeVerified(true);
        setTimer(0); // 타이머 제거
        setVerificationMessage("인증이 완료되었습니다.");
      }
    } catch (error) {
      setVerificationMessage("인증번호가 일치하지 않습니다.");
    }
  };

  // 닉네임 중복 확인 요청
  const handleCheckNickname = async () => {
    if (!validateNickname(nickname)) {
      setIsNicknameAvailable(false);
      setNicknameMessage("닉네임은 영문, 숫자, 한글이 입력 가능합니다(2~6자)");
      return;
    }
    try {
      const response = await checkNicknameAvailability(nickname);
      if (response) {
        setIsNicknameAvailable(true);
        setNicknameMessage("사용 가능한 닉네임입니다.");
      } else {
        setIsNicknameAvailable(false);
        setNicknameMessage("이미 사용 중인 닉네임입니다.");
      }
    } catch (error) {
      setNicknameMessage("닉네임 중복 확인 중 오류가 발생했습니다.");
    }
  };

  // 비밀번호와 비밀번호 확인 일치 검사 및 유효성 검사
  useEffect(() => {
    if (password) {
      if (!validatePassword(password)) {
        setPasswordMessage(
          "비밀번호는 8~20자, 영문, 숫자, 특수문자를 포함해야 합니다."
        );
      }
    } else {
      setPasswordMessage("");
    }
  }, [password]);

  useEffect(() => {
    if (passwordCheck) {
      if (password === passwordCheck) {
        setPasswordCheckMessage("비밀번호가 일치합니다.");
      } else {
        setPasswordCheckMessage("비밀번호가 일치하지 않습니다.");
      }
    } else {
      setPasswordCheckMessage("");
    }
  }, [passwordCheck])

  // 이메일 변경 시 인증 상태 초기화
  useEffect(() => {
    setIsCodeVerified(false);
    setIsCodeSent(false);
    setEmailMessage("");
    setVerificationMessage("");
    setTimer(0);
  }, [email]);

  // 닉네임 변경 시 확인 상태 초기화
  useEffect(() => {
    setIsNicknameAvailable(false);
    setNicknameMessage("");
  }, [nickname]);

  // 회원가입 처리
  const handleRegister = async () => {
    if (!validateEmail(email)) {
      setEmailMessage("유효하지 않은 이메일입니다.");
      return;
    }
    if (!validatePassword(password)) {
      setPasswordMessage(
        "비밀번호는 8~20자, 영문, 숫자, 특수문자를 포함해야 합니다."
      );
      return;
    }
    if (password !== passwordCheck) {
      setPasswordCheckMessage("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (!isCodeVerified) {
      setVerificationMessage("이메일 인증을 완료해주세요.");
      return;
    }
    if (!isNicknameAvailable) {
      setNicknameMessage("닉네임 중복 확인을 해주세요.");
      return;
    }

    try {
      const response = await registerUser({
        email,
        nickname,
        password,
        passwordCheck,
      });
      if (response) {
        alert("회원가입이 완료되었습니다.");
        navigate("/login");
      }
    } catch (error) {
      setEmailMessage("회원가입에 실패했습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] flex flex-col items-center pt-16">
      <Header title="회원가입" />
      <div className="w-[90%] max-w-md">
        {/* 이메일 입력 및 인증번호 전송 */}
        <div className="mb-4">
          <label className="text-sm font-semibold mb-1 block">이메일</label>
          <div className="flex items-center border rounded-lg bg-white pl-2">
            <input
              type="email"
              placeholder="사용가능한 이메일을 입력하세요"
              className="w-full outline-none text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              onClick={handleSendCode}
              className={`${isCodeSent ? "bg-gray-400 w-32" : "bg-[#FF93A5] w-32"
                } text-white text-sm font-bold p-2 m-2 rounded `}
              disabled={isCodeSent}
            >
              {isCodeSent ? "번호 전송 완료" : "인증 번호 전송"}
            </button>
          </div>
          {emailMessage && (
            <p
              className={`font-bold text-xs mt-1 ${isCodeSent ? "text-blue-400" : "text-red-500"
                }`}
            >
              {emailMessage}
            </p>
          )}
        </div>

        {/* 인증번호 입력 및 인증 확인 */}
        {isCodeSent && (
          <div className="mb-4">
            <label className="text-sm font-semibold mb-1 block">인증번호</label>
            <div className="flex items-center border rounded-lg bg-white pl-2">
              <input
                type="text"
                placeholder="이메일에 전송된 인증 번호를 입력하세요"
                className="w-full outline-none text-sm bg-white"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                disabled={isCodeVerified}
              />
              {timer > 0 && !isCodeVerified && (
                <span className="text-red-500 text-xs mr-2">
                  {formatTime(timer)}
                </span>
              )}
              <button
                onClick={handleVerifyCode}
                className={`${isCodeVerified ? "bg-gray-400 w-20" : "bg-[#FF93A5] w-16"
                  } text-white text-sm font-bold p-2 rounded m-2`}
                disabled={isCodeVerified}
              >
                {isCodeVerified ? "인증완료" : "인증"}
              </button>
            </div>
            {verificationMessage && (
              <p
                className={`text-xs mt-1 font-bold ${isCodeVerified ? "text-blue-400" : "text-red-500"
                  }`}
              >
                {verificationMessage}
              </p>
            )}
          </div>
        )}

        {/* 닉네임 입력 및 중복 확인 */}
        <div className="mb-6">
          <label className="text-sm font-semibold mb-1 block">닉네임</label>
          <div className="flex items-center border rounded-lg bg-white pl-2">
            <input
              type="text"
              placeholder="닉네임은 영문, 숫자, 한글이 입력 가능합니다(2~6자)"
              className="w-full outline-none text-sm"
              maxLength={8}
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
            <button
              onClick={handleCheckNickname}
              className="bg-[#FF93A5] text-white text-sm font-bold p-2 rounded w-16 m-2"
            >
              확인
            </button>
          </div>
          {nicknameMessage && (
            <p
              className={`text-xs mt-1 font-bold ${isNicknameAvailable ? "text-blue-400" : "text-red-500"
                }`}
            >
              {nicknameMessage}
            </p>
          )}
        </div>

        {/* 비밀번호 및 비밀번호 확인 */}
        <div className="mb-4">
          <label className="text-sm font-semibold mb-1 block">비밀번호</label>
          <div className="flex items-center border rounded-lg bg-white pl-2 pr-2">
            <input
              type="password"
              placeholder="비밀번호는 8~20자, 영문, 숫자, 특수문자를 포함해야 합니다."
              className="w-full outline-none text-sm pt-4 pb-4"
              maxLength={20}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {passwordMessage && (
            <p
              className={`text-xs mt-1 font-bold ${validatePassword(password)
                ? "text-blue-400"
                : "text-red-500"
                }`}
            >
              {passwordMessage}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label className="text-sm font-semibold mb-1 block">
            비밀번호 확인
          </label>
          <div className="flex items-center border rounded-lg bg-white pl-2 pr-2">
            <input
              type="password"
              placeholder="비밀번호를 다시 입력하세요"
              className="w-full outline-none text-sm pt-4 pb-4"
              maxLength={20}
              value={passwordCheck}
              onChange={(e) => setPasswordCheck(e.target.value)}
            />
          </div>
          {passwordCheckMessage && (
            <p
              className={`text-xs mt-1 font-bold ${validatePassword(password) && password === passwordCheck
                ? "text-blue-400"
                : "text-red-500"
                }`}
            >
              {passwordCheckMessage}
            </p>
          )}
        </div>

        {/* 완료 버튼 */}
        <button
          onClick={handleRegister}
          className={`w-[90%] max-w-md py-3 fixed bottom-8 left-1/2 transform -translate-x-1/2 rounded-lg font-bold text-lg ${isFormValid ? "bg-[#FF93A5]" : "bg-gray-400"
            } text-white`}
          disabled={!isFormValid}
        >
          회원 가입
        </button>
      </div>
    </div>
  );
};

export default Register;
