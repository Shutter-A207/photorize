import React from "react";

interface PoseModalProps {
  isOpen: boolean;
  image: string;
  onClose: () => void;
}

const PoseModal: React.FC<PoseModalProps> = ({ isOpen, image, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-lg p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-2 right-2">
          <img src="/assets/XIcon.png" alt="Close" className="w-6 h-6" />
        </button>
        <img src={image} alt="Enlarged Pose" className="w-full h-auto rounded-lg" />
      </div>
    </div>
  );
};

export default PoseModal;
