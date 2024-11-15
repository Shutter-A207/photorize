import React, { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { photoState, videoState } from "../../recoil/fileAtoms";

interface UploadItemProps {
  type: "photo" | "video";
  onUpload: (file: File) => void;
}

const UploadItem: React.FC<UploadItemProps> = ({ type, onUpload }) => {
  const [file, setFile] = useRecoilState(
    type === "photo" ? photoState : videoState
  );
  const [fileUrl, setFileUrl] = useState<string | undefined>(undefined);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    const maxSizeInMB = type === "photo" ? 5 : 10;
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  
    if (selectedFile.size > maxSizeInBytes) {
      alert(
        `${type === "photo" ? "사진" : "비디오"} 파일 크기가 너무 큽니다. 최대 ${maxSizeInMB}MB 이하의 파일만 업로드할 수 있습니다.`
      );
      return;
    }

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
    onUpload(selectedFile);
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

  useEffect(() => {
    return () => {
      setFile(null);
      setFileUrl(undefined);
    };
  }, [setFile]);

  return (
    <div className="flex flex-col bg-white rounded-lg p-3 w-1/2 border border-[#B3B3B3]">
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
        <span className="pl-1 text-[#BCBFC3] text-xs font-medium ml-1">
          {type === "photo" ? "사진(필수, 최대 5mb)" : "동영상(선택, 최대 10mb)"}
        </span>
      </div>

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
