import React from "react";

interface MemoInputProps {
  memo: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const MemoInput: React.FC<MemoInputProps> = ({ memo, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // 300자 제한
    if (e.target.value.length <= 300) {
      onChange(e);
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="flex items-left bg-white rounded-lg p-4 pb-6 w-full max-w-md min-h-32 mb-4 border border-[#B3B3B3]">
        <img src="/assets/memo-icon.png" alt="Memo Icon" className="h-5" />
        <textarea
          placeholder="메모"
          value={memo}
          onChange={handleChange}
          className="flex-grow bg-transparent ml-2 text-sm text-[#818181] placeholder-[#BCBFC3] placeholder:font-md ml-2 pb-6 outline-none resize-none scrollbar-hidden"
        />
        <div
          className={`absolute bottom-5 right-4 text-xs font-bold ${
            memo.length <= 0 || memo.length > 300
              ? "text-red-500"
              : "text-gray-500"
          }`}
        >
          {memo.length}/300
        </div>
      </div>
    </div>
  );
};

export default MemoInput;
