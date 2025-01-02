import React from "react";
import Header from "../../components/Common/Header";
import RegisterForm from "./RegisterForm";
import { useRegister } from "./useRegister";

const Register: React.FC = () => {
  const registerHook = useRegister();

  return (
    <div className="min-h-screen bg-[#F9F9F9] flex flex-col items-center pt-16 pb-24 scrollbar-hidden">
      <Header title="회원가입" />

      {/* RegisterForm: UI만 담당, 로직/상태는 useRegister()에서 prop으로 전달 */}
      <RegisterForm
        {...registerHook} // 모든 prop 한꺼번에 전달
      />
    </div>
  );
};

export default Register;
