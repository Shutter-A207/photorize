import React from "react";

interface MemoInputProps {
  memo: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const MemoInput: React.FC<MemoInputProps> = ({ memo, onChange }) => (
  <>
    <div className="flex items-left bg-white rounded-lg p-4 w-full max-w-md min-h-32 mb-4 border border-[#B3B3B3]">
      <img src="/assets/memo-icon.png" alt="Memo Icon" className="h-5" />
      <textarea
        placeholder="메모"
        value={memo}
        onChange={onChange}
        className="flex-grow bg-transparent text-sm text-[#818181] placeholder-[#BCBFC3] placeholder:font-medium ml-2 outline-none"
      />
    </div>
  </>
);

export default MemoInput;
