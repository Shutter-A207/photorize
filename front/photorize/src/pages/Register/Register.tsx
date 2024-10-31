import React from "react";
import Header from "../../components/Common/Header";

const Register = () => {
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
            />
          </div>
        </div>

        {/* 닉네임 입력 */}
        <div className="mb-6">
          <label className="text-sm font-semibold mb-1 block">닉네임</label>
          <div className="flex items-center border rounded-lg bg-white pl-2 ">
            <input
              type="text"
              placeholder="닉네임을 입력하세요"
              className="w-full outline-none text-sm"
            />
            <button className="bg-[#FF93A5] text-white text-sm font-bold p-2 rounded w-16 m-2">
              확인
            </button>
          </div>
        </div>

        {/* 완료 버튼 */}
        <button className="bg-[#FF93A5] text-white w-[90%] max-w-md py-3 fixed bottom-8 left-1/2 transform -translate-x-1/2 rounded-lg font-bold text-lg">
          완료
        </button>
      </div>
    </div>
  );
};

export default Register;
