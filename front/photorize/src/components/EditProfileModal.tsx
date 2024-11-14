// EditProfileModal.tsx
import React, { useState, useRef } from "react";
import { updateProfileImage } from "../api/UserAPI";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfileImg: string;
  onProfileUpdate: (newProfileImg: string) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  currentProfileImg,
  onProfileUpdate,
}) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleSubmit = async () => {
    if (selectedImage) {
      try {
        const updatedImageUrl = await updateProfileImage(selectedImage);
        onProfileUpdate(updatedImageUrl);
        handleClose();
      } catch (error) {
        console.error("프로필 이미지 업데이트 중 오류 발생:", error);
        alert("프로필 이미지를 업데이트하는 중에 오류가 발생했습니다.");
      }
    }
  };

  const handleClose = () => {
    setSelectedImage(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-80">
        <h2 className="text-xl font-bold mb-4">프로필 편집</h2>
        <div className="relative w-24 h-24 mx-auto mb-4 cursor-pointer" onClick={handleImageClick}>
          <img
            src={selectedImage ? URL.createObjectURL(selectedImage) : currentProfileImg}
            alt="Current Profile"
            className="w-full h-full rounded-full"
          />
          <img
            src="/assets/cameraIcon.png"
            alt="Camera Icon"
            className="absolute bottom-0 right-0 w-6 h-6"
          />
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageChange}
          style={{ display: "none" }}
        />
        <div className="flex justify-end space-x-2">
          <button onClick={handleClose} className="px-4 py-2 bg-gray-300 rounded">
            취소
          </button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-[#FF93A5] text-white rounded">
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;