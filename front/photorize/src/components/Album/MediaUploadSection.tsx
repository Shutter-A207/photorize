import React from "react";
import UploadItem from "../../components/Album/UploadItem";

interface MediaUploadSectionProps {
  onPhotoUpload: (files: File[]) => void;
  onVideoUpload: (files: File[]) => void;
}

const MediaUploadSection: React.FC<MediaUploadSectionProps> = ({
  onPhotoUpload,
  onVideoUpload,
}) => (
  <div className="flex space-x-3 w-full max-w-md min-h-24">
    <UploadItem type="photo" onUpload={onPhotoUpload} />
    <UploadItem type="video" onUpload={onVideoUpload} />
  </div>
);

export default MediaUploadSection;
