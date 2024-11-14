import React, { useState, useEffect } from "react";
import { updateNickname, checkNicknameAvailability } from "../api/UserAPI";

interface EditNicknameModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentNickname: string;
  onNicknameChange: (newNickname: string) => void;
}

const EditNicknameModal: React.FC<EditNicknameModalProps> = ({
  isOpen,
  onClose,
  currentNickname,
  onNicknameChange,
}) => {
  const [nickname, setNickname] = useState(currentNickname);
  const [isDuplicateChecked, setIsDuplicateChecked] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [duplicateMessage, setDuplicateMessage] = useState("");

  useEffect(() => {
    if (isOpen) {
      setNickname(currentNickname);
      setIsDuplicateChecked(false);
      setIsDuplicate(false);
      setDuplicateMessage("");
    }
  }, [isOpen, currentNickname]);

  const handleCheckDuplicate = async () => {
    if (nickname.length >= 2 && nickname.length <= 8) {
      try {
        const available = await checkNicknameAvailability(nickname);
        setIsDuplicate(!available);
        setIsDuplicateChecked(true);
        setDuplicateMessage(
          available
            ? "사용 가능한 닉네임입니다."
            : "이미 사용 중인 닉네임입니다."
        );
      } catch (error) {
        setDuplicateMessage(
          "닉네임의 형식이 올바르지 않습니다. (영어, 한글, 숫자 조합만 가능)"
        );
      }
    } else {
      setDuplicateMessage("닉네임은 2자 이상 8자 이하여야 합니다.");
    }
  };

  const handleUpdate = async () => {
    if (
      nickname.length >= 2 &&
      nickname.length <= 8 &&
      isDuplicateChecked &&
      !isDuplicate
    ) {
      try {
        const updatedUserInfo = await updateNickname(nickname);
        onNicknameChange(updatedUserInfo.nickname);
        onClose();
      } catch (error) {
        setDuplicateMessage("닉네임 수정 중 오류가 발생했습니다.");
      }
    } else {
      setDuplicateMessage("닉네임 중복 체크를 해주세요.");
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-lg relative">
          <button onClick={onClose} className="absolute top-4 right-4">
            <img src="/assets/XIcon.png" alt="Close Icon" className="h-4" />
          </button>
          <h2 className="text-base text-[#818181] font-bold mb-4">
            닉네임 수정하기
          </h2>
          <p className="text-xs text-[#BCBFC3] mb-2">
            닉네임은 최소 2자, 최대 8자입니다.
          </p>
          <div className="flex items-center mb-2">
            <input
              type="text"
              placeholder="닉네임 입력"
              value={nickname}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length <= 8) {
                  setNickname(value);
                  setIsDuplicateChecked(false); // 닉네임 변경 시 중복 체크 초기화
                  setDuplicateMessage("");
                }
              }}
              className="w-full border border-[#B3B3B3] rounded-lg p-2 text-sm text-[#818181] placeholder-[#BCBFC3] outline-none"
            />
            <button
              onClick={handleCheckDuplicate}
              className="ml-2 bg-[#FF93A5] text-white text-sm font-medium w-24 h-10 rounded-lg"
            >
              중복 체크
            </button>
          </div>
          {duplicateMessage && (
            <p
              className={`text-xs font-bold mt-1 ${
                isDuplicate ||
                duplicateMessage.includes("오류") ||
                duplicateMessage.includes("올바르지")
                  ? "text-red-400"
                  : "text-blue-400"
              }`}
            >
              {duplicateMessage}
            </p>
          )}
          <div className="flex justify-end mt-4">
            <button
              onClick={handleUpdate}
              disabled={!isDuplicateChecked || isDuplicate}
              className={`${
                isDuplicateChecked && !isDuplicate
                  ? "bg-[#FF93A5] text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              } text-sm font-medium py-2 px-4 rounded-full`}
            >
              수정
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default EditNicknameModal;
