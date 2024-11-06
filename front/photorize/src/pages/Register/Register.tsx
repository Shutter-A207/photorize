import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Common/Header";
import { registerUser } from "../../api/UserAPI"; // API 함수 불러오기

const Register = () => {
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [verificationCode, setVerificationCode] = useState(""); // 인증번호 상태 추가
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!email || !nickname || !password || !passwordCheck) {
      alert("모든 필드를 입력해주세요.");
      return;
    }
    if (password !== passwordCheck) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const response = await registerUser({
        email,
        nickname,
        password,
        passwordCheck,
      });
      console.log(response);
      if (response) {
        alert("회원가입이 완료되었습니다.");
        navigate("/login");
      }
    } catch (error) {
      alert("회원가입에 실패했습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] flex flex-col items-center pt-16">
      <Header title="회원가입" />
      <div className="w-[90%] max-w-md">
        {/* 이메일 입력 */}
        <div className="mb-4">
          <label className="text-sm font-semibold mb-1 block">이메일</label>
          <div className="flex items-center border rounded-lg bg-white pl-2">
            <input
              type="email"
              placeholder="이메일을 입력하세요"
              className="w-full outline-none text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="bg-[#FF93A5] text-white text-sm font-bold p-2 m-2 rounded w-16">
              전송
            </button>
          </div>
        </div>

        {/* 인증번호 입력 */}
        <div className="mb-4">
          <label className="text-sm font-semibold mb-1 block">인증번호</label>
          <div className="flex items-center border rounded-lg bg-white pl-2">
            <input
              type="text"
              placeholder="인증번호를 입력하세요"
              className="w-full outline-none text-sm"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
            />
            <button className="bg-[#FF93A5] text-white text-sm font-bold p-2 rounded w-16 m-2">
              인증
            </button>
          </div>
        </div>

        {/* 비밀번호 입력 */}
        <div className="mb-4">
          <label className="text-sm font-semibold mb-1 block">비밀번호</label>
          <div className="flex items-center border rounded-lg bg-white pl-2 pr-2">
            <input
              type="password"
              placeholder="비밀번호를 입력하세요"
              className="w-full outline-none text-sm pt-4 pb-4"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        {/* 비밀번호 확인 입력 */}
        <div className="mb-4">
          <label className="text-sm font-semibold mb-1 block">
            비밀번호 확인
          </label>
          <div className="flex items-center border rounded-lg bg-white pl-2 pr-2">
            <input
              type="password"
              placeholder="비밀번호를 다시 입력하세요"
              className="w-full outline-none text-sm pt-4 pb-4"
              value={passwordCheck}
              onChange={(e) => setPasswordCheck(e.target.value)}
            />
          </div>
        </div>

        {/* 닉네임 입력 */}
        <div className="mb-6">
          <label className="text-sm font-semibold mb-1 block">닉네임</label>
          <div className="flex items-center border rounded-lg bg-white pl-2">
            <input
              type="text"
              placeholder="닉네임을 입력하세요"
              className="w-full outline-none text-sm"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
            <button className="bg-[#FF93A5] text-white text-sm font-bold p-2 rounded w-16 m-2">
              확인
            </button>
          </div>
        </div>

        {/* 완료 버튼 */}
        <button
          onClick={handleRegister}
          className="bg-[#FF93A5] text-white w-[90%] max-w-md py-3 fixed bottom-8 left-1/2 transform -translate-x-1/2 rounded-lg font-bold text-lg"
        >
          완료
        </button>
      </div>
    </div>
  );
};

export default Register;
