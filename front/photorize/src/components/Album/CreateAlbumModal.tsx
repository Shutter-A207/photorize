import React, { useState, useEffect } from "react";
import SearchTag from "../../components/Common/SearchTag";
import { fetchColors, createAlbum } from "../../api/AlbumAPI";

interface Album {
  id: number | null;
  name: string | null;
  members: string[] | null;
}

interface User {
  id: number;
  name: string;
}

interface Color {
  id: number;
  code: string;
}

interface CreateAlbumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (album: Album) => void;
}

const CreateAlbumModal: React.FC<CreateAlbumModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [albumName, setAlbumName] = useState("");
  const [selectedColor, setSelectedColor] = useState<Color>({
    id: 1,
    code: "#f16f74",
  });
  const [tags, setTags] = useState<User[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadColors = async () => {
      try {
        const response = await fetchColors();
        if (response && response.status === 200) {
          const colorData = response.data.colors.map(
            (data: { id: number; colorCode: string }) => ({
              id: data.id,
              code: data.colorCode,
            })
          );
          setColors(colorData);
        }
      } catch (error) {
        console.error("컬러를 불러오는 중 오류가 발생했습니다:", error);
      }
    };
    if (isOpen) {
      loadColors();
    }
  }, [isOpen]);

  const handleCreate = async () => {
    try {
      setIsLoading(true);
      const response = await createAlbum(
        albumName,
        selectedColor.id,
        tags.map((tag) => tag.id)
      );
      if (response) {
        const newAlbum: Album = {
          id: response.data.albumId,
          name: response.data.name,
          members: response.data.members,
        };
        onSuccess?.(newAlbum);
        handleClose();
      }
    } catch (error) {
      console.error("앨범 생성 중 오류가 발생했습니다:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleAlbumNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= 12) {
      setAlbumName(e.target.value);
    }
  };

  const handleClose = () => {
    setAlbumName("");
    setSelectedColor({ id: 1, code: "#f16f74" });
    setTags([]);
    onClose();
  };

  const isFormValid =
    albumName.trim() !== "" && selectedColor.id !== 0 && tags.length > 0;

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 w-full">
        <div className="bg-white rounded-lg p-6 w-full max-w-lg relative">
          <button onClick={handleClose} className="absolute top-4 right-4">
            <img src="/assets/XIcon.png" alt="Close Icon" className="h-4" />
          </button>
          <h2 className="text-base text-[#818181] font-bold mb-4">
            새 앨범 만들기
          </h2>
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="앨범명을 입력해 주세요"
              value={albumName}
              onChange={handleAlbumNameChange}
              className="w-full border border-[#B3B3B3] rounded-lg p-2 text-sm text-[#818181] placeholder-[#BCBFC3] outline-none"
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
          <p className="text-[#818181] mb-3 text-sm">
            함께 할 친구를 검색해 보세요
          </p>
          <SearchTag
            imageSrc="/assets/tag-icon.png"
            placeholder="태그"
            onChange={setTags}
          />
          <p className="text-[#818181] my-3 text-sm">앨범색을 선택해 주세요</p>
          <div className="flex justify-around mb-4 mt-4">
            {colors.map((color) => (
              <div
                key={color.id}
                className="w-6 h-6 rounded-full cursor-pointer"
                style={{
                  backgroundColor: color.code,
                  border:
                    selectedColor.id === color.id ? "2px solid #000" : "none",
                }}
                onClick={() => setSelectedColor(color)}
              ></div>
            ))}
          </div>
          <div className="flex justify-end items-center">
            {!isFormValid && (
              <p className="text-sm text-[#FF4D4F] mr-2">
                모든 값을 입력해 주세요
              </p>
            )}
            <button
              onClick={handleCreate}
              disabled={!isFormValid || isLoading}
              className={`${
                isFormValid && !isLoading
                  ? "bg-[#FF93A5] text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              } text-sm font-medium py-2 px-4 rounded-full w-24`}
            >
              {isLoading ? "생성 중..." : "생성"}
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default CreateAlbumModal;
