import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  generateAuthCode,
  verifyAuthCode,
  checkNicknameAvailability,
  registerUser,
} from "../../api/UserAPI";
import { useToast } from "../../components/Common/ToastProvider";

function validateEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,50}$/;
  return emailRegex.test(email);
}

function validatePassword(password: string): boolean {
  // 8~20자, 영문+숫자+특수문자( !@#$%^&()_\-+= ) 모두 포함
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&()_\-+=]).{8,20}$/;
  return passwordRegex.test(password);
}

function validateNickname(nickname: string): boolean {
  // 2~8자, 영문+숫자+한글
  const nicknameRegex = /^[a-zA-Z0-9가-힣]{2,8}$/;
  return nicknameRegex.test(nickname);
}

export function useRegister() {
  const { showToast } = useToast();
  const navigate = useNavigate();

  // 상태
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [isNicknameAvailable, setIsNicknameAvailable] = useState(false);

  // 메시지
  const [emailMessage, setEmailMessage] = useState("");
  const [verificationMessage, setVerificationMessage] = useState("");
  const [nicknameMessage, setNicknameMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordCheckMessage, setPasswordCheckMessage] = useState("");

  // 인증번호 타이머
  const [timer, setTimer] = useState(0);
  const [isCodeSent, setIsCodeSent] = useState(false);

  // 전체 폼 유효성
  const [isFormValid, setIsFormValid] = useState(false);

  // ─────────────────────────────
  // 1) 이메일 인증번호 요청 + 타이머
  // ─────────────────────────────
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
        setTimer(300); // 5분 (300초)
        setIsCodeSent(true);
      }
    } catch (error) {
      setEmailMessage("사용 중인 이메일입니다.");
    }
  };

  // ─────────────────────────────
  // 2) 인증번호 타이머
  // ─────────────────────────────
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0 && interval) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // 남은 시간 형식 변환 (분:초)
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // ─────────────────────────────
  // 3) 인증번호 검증
  // ─────────────────────────────
  const handleVerifyCode = async () => {
    try {
      const response = await verifyAuthCode({
        email,
        authCode: verificationCode,
        authType: "SIGNUP",
      });
      if (response) {
        setIsCodeVerified(true);
        setTimer(0);
        setVerificationMessage("인증이 완료되었습니다.");
      }
    } catch (error) {
      setVerificationMessage("인증번호가 일치하지 않습니다.");
    }
  };

  // ─────────────────────────────
  // 4) 닉네임 중복 확인
  // ─────────────────────────────
  const handleCheckNickname = async () => {
    if (!validateNickname(nickname)) {
      setIsNicknameAvailable(false);
      setNicknameMessage("닉네임은 영문, 숫자, 한글 2~8자만 가능합니다.");
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

  // ─────────────────────────────
  // 5) 비밀번호 유효성 + 비밀번호 확인
  // ─────────────────────────────
  useEffect(() => {
    if (password) {
      if (!validatePassword(password)) {
        setPasswordMessage("비밀번호는 8~20자, 영문+숫자+특수문자를 포함해야 합니다.");
      } else {
        setPasswordMessage("");
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
  }, [passwordCheck, password]);

  // ─────────────────────────────
  // 6) 이메일 or 닉네임 값 바뀌면 인증상태/닉네임확인 상태 초기화
  // ─────────────────────────────
  useEffect(() => {
    setIsCodeVerified(false);
    setIsCodeSent(false);
    setEmailMessage("");
    setVerificationMessage("");
    setTimer(0);
  }, [email]);

  useEffect(() => {
    setIsNicknameAvailable(false);
    setNicknameMessage("");
  }, [nickname]);

  // ─────────────────────────────
  // 7) 전체 폼 유효성 검사
  // ─────────────────────────────
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

  // ─────────────────────────────
  // 8) 회원가입 처리
  // ─────────────────────────────
  const handleRegister = async () => {
    // 혹시나 남아있을 수 있는 유효성 검사
    if (!validateEmail(email)) {
      setEmailMessage("유효하지 않은 이메일입니다.");
      return;
    }
    if (!validatePassword(password)) {
      setPasswordMessage("비밀번호는 8~20자, 영문, 숫자, 특수문자를 포함해야 합니다.");
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
        showToast("회원가입이 완료되었습니다!", "success");
        navigate("/login");
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || "회원가입에 실패했습니다";
      showToast(errorMessage, "error");
    }
  };

  return {
    // 상태 & 값
    email,
    setEmail,
    nickname,
    setNickname,
    password,
    setPassword,
    passwordCheck,
    setPasswordCheck,
    verificationCode,
    setVerificationCode,

    // 메시지
    emailMessage,
    verificationMessage,
    nicknameMessage,
    passwordMessage,
    passwordCheckMessage,

    // 인증 상태
    isCodeVerified,
    isNicknameAvailable,
    isCodeSent,
    timer,
    formatTime,
    isFormValid,

    // 핸들러
    handleSendCode,
    handleVerifyCode,
    handleCheckNickname,
    handleRegister,
  };
}
