import React, { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { photoState, videoState } from "../../recoil/fileAtoms";

interface UploadItemProps {
  type: "photo" | "video";
  onUpload: (files: File[]) => void;
}

const UploadItem: React.FC<UploadItemProps> = ({ type, onUpload }) => {
  const [file, setFile] = useRecoilState(
    type === "photo" ? photoState : videoState
  );
  const [fileUrl, setFileUrl] = useState<string | undefined>(undefined);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    // 파일 확장자 검증
    const validExtensions = {
      photo: [
        "jpg",
        "jpeg",
        "png",
        "bmp",
        "webp",
        "heif",
        "heic",
        "tiff",
        "tif",
      ],
      video: ["mp4", "mov", "mpeg-4", "avi", "mkv", "webm", "wmv", "flv"],
    };

    const fileExtension = selectedFile.name.split(".").pop()?.toLowerCase();
    if (!fileExtension || !validExtensions[type].includes(fileExtension)) {
      alert(`유효한 ${type} 파일을 업로드해 주세요.`);
      return;
    }

    setFile(selectedFile);
    onUpload([selectedFile]); // onUpload 호출로 파일을 외부로 전달
  };

  const handleRemoveFile = () => {
    setFile(null);
    setFileUrl(undefined);
  };

  useEffect(() => {
    if (file) {
      const newUrl = URL.createObjectURL(file);
      setFileUrl(newUrl);

      return () => {
        URL.revokeObjectURL(newUrl);
      };
    }
  }, [file]);

  return (
    <div className="flex flex-col bg-white rounded-lg p-3 w-1/2 border border-[#B3B3B3]">
      {/* 아이콘과 텍스트 */}
      <div className="flex items-center mb-2">
        <img
          src={
            type === "photo"
              ? "/assets/picture-icon.png"
              : "/assets/video-icon.png"
          }
          alt={`${type} Icon`}
          className="h-4"
        />
        <span className="text-[#BCBFC3] text-xs font-medium ml-1">
          {type === "photo" ? "사진" : "동영상"}
        </span>
      </div>

      {/* 파일 미리보기 또는 추가 아이콘 */}
      <div className="flex items-center justify-center w-full h-28 border border-gray-300 rounded-lg relative">
        {file ? (
          <div className="relative w-full h-full">
            {type === "video" ? (
              <video
                src={fileUrl}
                controls={false}
                className="object-contain w-full h-full rounded-lg p-2"
              />
            ) : (
              <img
                src={fileUrl}
                alt="Preview"
                className="object-contain w-full h-full rounded-lg p-2"
              />
            )}
            <button
              onClick={handleRemoveFile}
              className="absolute top-0 right-0 w-5 h-5 rounded-full p-1 text-gray-600"
            >
              <img
                src="/assets/remove-icon.png"
                alt="Remove Icon"
                className="w-full h-full"
              />
            </button>
          </div>
        ) : (
          <label className="cursor-pointer flex items-center justify-center w-full h-full">
            <input
              type="file"
              onChange={handleFileChange}
              accept={
                type === "photo"
                  ? ".jpg,.jpeg,.png,.bmp,.webp,.heif,.heic,.tiff,.tif"
                  : ".mp4,.mov,.mpeg-4,.avi,.mkv,.webm,.wmv,.flv"
              }
              className="hidden"
            />
            <img
              src="/assets/add-icon.png"
              alt="Add Icon"
              className="h-8 w-8"
            />
          </label>
        )}
      </div>
    </div>
  );
};

export default UploadItem;
