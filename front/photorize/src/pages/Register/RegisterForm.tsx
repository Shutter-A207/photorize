import React from "react";

interface RegisterFormProps {
  // 상태
  email: string;
  setEmail: (val: string) => void;
  nickname: string;
  setNickname: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  passwordCheck: string;
  setPasswordCheck: (val: string) => void;
  verificationCode: string;
  setVerificationCode: (val: string) => void;

  // 메시지
  emailMessage: string;
  verificationMessage: string;
  nicknameMessage: string;
  passwordMessage: string;
  passwordCheckMessage: string;

  // 인증 상태
  isCodeVerified: boolean;
  isNicknameAvailable: boolean;
  isCodeSent: boolean;
  timer: number;
  formatTime: (time: number) => string;
  isFormValid: boolean;

  // 핸들러
  handleSendCode: () => Promise<void>;
  handleVerifyCode: () => Promise<void>;
  handleCheckNickname: () => Promise<void>;
  handleRegister: () => Promise<void>;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
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

  emailMessage,
  verificationMessage,
  nicknameMessage,
  passwordMessage,
  passwordCheckMessage,

  isCodeVerified,
  isNicknameAvailable,
  isCodeSent,
  timer,
  formatTime,
  isFormValid,

  handleSendCode,
  handleVerifyCode,
  handleCheckNickname,
  handleRegister,
}) => {
  return (
    <div className="w-[90%] max-w-md">
      {/* 이메일 + 인증번호 전송 */}
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
            className={`${
              isCodeSent ? "bg-gray-400 w-44" : "bg-[#FF93A5] w-44"
            } text-white text-sm font-bold p-2 m-2 rounded `}
            disabled={isCodeSent}
          >
            {isCodeSent ? "번호 전송 완료" : "인증 번호 전송"}
          </button>
        </div>
        {emailMessage && (
          <p
            className={`font-bold text-xs mt-1 ${
              isCodeSent ? "text-blue-400" : "text-red-500"
            }`}
          >
            {emailMessage}
          </p>
        )}
      </div>

      {/* 인증번호 입력 + 타이머 + 인증 버튼 */}
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
              <span className="text-red-500 text-xs mr-2">{formatTime(timer)}</span>
            )}
            <button
              onClick={handleVerifyCode}
              className={`${
                isCodeVerified ? "bg-gray-400 w-20" : "bg-[#FF93A5] w-16"
              } text-white text-sm font-bold p-2 rounded m-2`}
              disabled={isCodeVerified}
            >
              {isCodeVerified ? "인증완료" : "인증"}
            </button>
          </div>
          {verificationMessage && (
            <p
              className={`text-xs mt-1 font-bold ${
                isCodeVerified ? "text-blue-400" : "text-red-500"
              }`}
            >
              {verificationMessage}
            </p>
          )}
        </div>
      )}

      {/* 닉네임 */}
      <div className="mb-6">
        <label className="text-sm font-semibold mb-1 block">닉네임</label>
        <div className="flex items-center border rounded-lg bg-white pl-2">
          <input
            type="text"
            placeholder="닉네임은 최소 2자, 최대 8자 입니다."
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
            className={`text-xs mt-1 font-bold ${
              isNicknameAvailable ? "text-blue-400" : "text-red-500"
            }`}
          >
            {nicknameMessage}
          </p>
        )}
      </div>

      {/* 비밀번호 */}
      <div className="mb-4">
        <label className="text-sm font-semibold mb-1 block">비밀번호</label>
        <div className="flex items-center border rounded-lg bg-white pl-2 pr-2">
          <input
            type="password"
            placeholder="비밀번호는 8~20자, 영문+숫자+특수문자를 포함"
            className="w-full outline-none text-sm pt-4 pb-4"
            maxLength={20}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {passwordMessage && (
          <p
            className={`text-xs mt-1 font-bold ${
              passwordMessage.includes("비밀번호가 일치합니다")
                ? "text-blue-400"
                : "text-red-500"
            }`}
          >
            {passwordMessage}
          </p>
        )}
      </div>

      {/* 비밀번호 확인 */}
      <div className="mb-4">
        <label className="text-sm font-semibold mb-1 block">비밀번호 확인</label>
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
            className={`text-xs mt-1 font-bold ${
              passwordCheckMessage.includes("일치합니다")
                ? "text-blue-400"
                : "text-red-500"
            }`}
          >
            {passwordCheckMessage}
          </p>
        )}
      </div>

      {/* 가입 버튼 */}
      <button
        onClick={handleRegister}
        className={`w-[90%] max-w-md py-3 fixed bottom-8 left-1/2 transform -translate-x-1/2 rounded-lg font-bold text-lg ${
          isFormValid ? "bg-[#FF93A5]" : "bg-gray-400"
        } text-white`}
        disabled={!isFormValid}
      >
        회원 가입
      </button>
    </div>
  );
};

export default RegisterForm;
