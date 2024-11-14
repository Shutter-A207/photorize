import React, { useState } from "react";
import { updateAlbum } from "../../api/AlbumAPI";

export interface AlbumData {
  albumId: number;
  name: string;
  colorId: number;
  colorCode: string;
  type: string;
}

interface EditAlbumModalProps {
  isOpen: boolean;
  onClose: () => void;
  albumName: string;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedColor: string;
  onSelectColor: (color: string) => void;
  albumId: number;
  albumType: string;
  onSuccess: (updateAlbum: AlbumData) => void; // 성공 시 호출될 콜백 함수
}

const COLORS = [
  { id: 1, code: "#f16f74" },
  { id: 2, code: "#ff924a" },
  { id: 3, code: "#f4d35e" },
  { id: 4, code: "#a4c19e" },
  { id: 5, code: "#4A90E2" },
  { id: 6, code: "#425577" },
  { id: 7, code: "#835f94" },
  { id: 8, code: "#f78fb3" },
  { id: 9, code: "#a6d5ff" },
  { id: 10, code: "#b0b0b0" },
];

const EditAlbumModal: React.FC<EditAlbumModalProps> = ({
  isOpen,
  onClose,
  albumName,
  onNameChange,
  selectedColor,
  onSelectColor,
  albumId,
  albumType,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 관리

  const handleUpdate = async () => {
    setIsLoading(true); // 로딩 시작
    try {
      const selectedColorId = COLORS.find(
        (color) => color.code === selectedColor
      )?.id;
      if (!selectedColorId) throw new Error("Invalid color selected");

      await updateAlbum(albumId, albumName, selectedColorId);

      // 업데이트된 앨범 정보를 onSuccess 콜백에 전달하여 즉시 반영
      onSuccess({
        albumId,
        name: albumName,
        colorId: selectedColorId,
        colorCode: selectedColor,
        type: albumType,
      });
      onClose();
    } catch {
      alert("앨범 수정 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };

  const isFormValid =
    albumName.trim() !== "" && albumName.length <= 12 && selectedColor !== "";

  const handleAlbumNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= 12) {
      onNameChange(e);
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 w-full">
        <div className="bg-white rounded-lg p-6 w-full max-w-lg relative">
          <button onClick={onClose} className="absolute top-4 right-4">
            <img src="/assets/XIcon.png" alt="Close Icon" className="h-4" />
          </button>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base text-[#818181] font-bold">
              앨범 수정하기
            </h2>
          </div>
          <p className="text-[#818181] mb-3 text-sm">앨범명을 입력해 주세요</p>
          <div className="relative mb-4">
            <input
              type="text"
              value={albumName}
              onChange={handleAlbumNameChange}
              className="w-full border border-[#B3B3B3] rounded-lg p-2 text-sm text-[#818181] outline-none"
            />
            <div
              className={`absolute bottom-1 right-2 text-xs font-bold ${
                albumName.length <= 0 || albumName.length > 12
                  ? "text-red-500"
                  : "text-gray-500"
              }`}
            >
              {albumName.length}/12
            </div>
          </div>
          <p className="text-[#818181] mb-3 text-sm">앨범색을 선택해 주세요</p>
          <div className="flex justify-around mb-4 mt-4">
            {COLORS.map((color) => (
              <div
                key={color.id}
                className="w-6 h-6 rounded-full cursor-pointer"
                style={{
                  backgroundColor: color.code,
                  border:
                    selectedColor === color.code ? "2px solid #000" : "none",
                }}
                onClick={() => onSelectColor(color.code)}
              ></div>
            ))}
          </div>
          <div className="flex items-center justify-end">
            {!isFormValid && (
              <p className="text-sm text-[#FF4D4F] mr-4">
                모든 값을 입력해 주세요
              </p>
            )}
            <button
              onClick={handleUpdate}
              disabled={!isFormValid || isLoading}
              className={`${
                isFormValid && !isLoading
                  ? "bg-[#FF93A5] text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              } text-sm font-medium py-2 px-4 rounded-full w-20`}
            >
              {isLoading ? "수정 중..." : "수정"}
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default EditAlbumModal;
