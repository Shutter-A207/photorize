// ConfirmationModal.tsx
import React from "react";

interface ConfirmationModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  message,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-4 rounded shadow-lg w-80">
        <p className="text-center mb-4">{message}</p>
        <div className="flex justify-around">
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-[#FF93A5] text-white rounded"
          >
            확인
          </button>
          <button onClick={onCancel} className="px-4 py-2 bg-gray-300 rounded">
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
