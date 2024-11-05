import React from "react";
import SearchTag from "../../components/Common/SearchTag";

interface CreateAlbumModalProps {
  isOpen: boolean;
  onClose: () => void;
  albumName: string;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCreate: () => void;
  selectedColor: string;
  onSelectColor: (color: string) => void;
  onTagChange: (tags: string[]) => void;
  tags: string[];
}

const COLORS = [
  "#f16f74",
  "#ff924a",
  "#f4d35e",
  "#a4c19e",
  "#4A90E2",
  "#425577",
  "#835f94",
  "#f78fb3",
  "#a6d5ff",
  "#b0b0b0",
];

const CreateAlbumModal: React.FC<CreateAlbumModalProps> = ({
  isOpen,
  onClose,
  albumName,
  onNameChange,
  onCreate,
  selectedColor,
  onSelectColor,
  onTagChange,
  tags,
}) => {
  // 모든 필수 입력 항목이 입력되었는지 확인하는 변수
  const isFormValid =
    albumName.trim() !== "" && selectedColor !== "" && tags.length > 0;

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 w-full">
        <div className="bg-white rounded-lg p-6 w-full max-w-lg relative">
          <button onClick={onClose} className="absolute top-4 right-4">
            <img src="/assets/XIcon.png" alt="Close Icon" className="h-4" />
          </button>
          <h2 className="text-base text-[#818181] font-bold mb-4">
            새 앨범 만들기
          </h2>
          <input
            type="text"
            placeholder="앨범 이름 입력"
            value={albumName}
            onChange={onNameChange}
            className="w-full border border-[#B3B3B3] rounded-lg p-2 mb-4 text-sm text-[#818181] placeholder-[#BCBFC3] outline-none"
          />
          <p className="text-[#818181] mb-3 text-sm">함께 할 친구</p>
          <SearchTag
            imageSrc="/assets/tag-icon.png"
            placeholder="태그"
            onChange={onTagChange}
          />
          <p className="text-[#818181] mb-3 text-sm">앨범 색</p>
          <div className="flex justify-around mb-4 mt-4">
            {COLORS.map((color) => (
              <div
                key={color}
                className="w-6 h-6 rounded-full cursor-pointer"
                style={{
                  backgroundColor: color,
                  border: selectedColor === color ? "2px solid #000" : "none",
                }}
                onClick={() => onSelectColor(color)}
              ></div>
            ))}
          </div>
          <div className="flex justify-end">
            <button
              onClick={onCreate}
              className={`${
                isFormValid
                  ? "bg-[#FF93A5] text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              } text-sm font-medium py-2 px-4 rounded-full w-1/4`}
              disabled={!isFormValid}
            >
              생성
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default CreateAlbumModal;
