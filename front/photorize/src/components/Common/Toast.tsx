import React, { useEffect } from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "warning" | "info";
  duration?: number;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = "success",
  duration = 3000,
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getBackgroundColor = () => {
    switch (type) {
      case "success":
        return "bg-green-100";
      case "error":
        return "bg-red-100";
      case "warning":
        return "bg-yellow-100";
      case "info":
        return "bg-blue-100";
      default:
        return "bg-white";
    }
  };

  const getTextColor = () => {
    switch (type) {
      case "success":
        return "text-green-800";
      case "error":
        return "text-red-800";
      case "warning":
        return "text-yellow-800";
      case "info":
        return "text-blue-800";
      default:
        return "text-gray-800";
    }
  };

  return (
    <div
      className={`fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-lg py-6 px-6 shadow-lg 
    ${getBackgroundColor()} ${getTextColor()} 
    transition-transform duration-300 ease-in-out z-50 flex justify-center items-center`}
      onClick={onClose}
      role="alert"
    >
      <div className="flex items-center gap-2">
        {type === "success" && <span>✓</span>}
        {type === "error" && <span>✕</span>}
        {type === "warning" && <span>⚠</span>}
        {type === "info" && <span>ℹ</span>}
        <p className="font-medium text-center">{message}</p>
      </div>
    </div>
  );
};
