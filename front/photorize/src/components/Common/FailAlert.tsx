import React from "react";
import { Button } from "primereact/button";

const FailAlert = ({ message, onClose }) => {
  return (
    <div className="w-[300px] h-[250px] bg-white rounded-xl flex flex-col items-center justify-center p-4 shadow-lg">
      <img src="/assets/XIcon2.png" alt="실패 아이콘" className="w-12 h-12" />
      <div className="mt-8 text-[16px] font-bold text-center">{message}</div>
      <Button
        label="확인"
        className="mt-10 w-[90%] bg-[#FF93A5] text-white font-bold"
        onClick={onClose}
      />
    </div>
  );
};

export default FailAlert;
