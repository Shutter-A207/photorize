import React, { createContext, useContext, useState, useCallback } from "react";
import { Toast } from "./Toast";

interface ToastContextType {
  showToast: (
    message: string,
    type?: "success" | "error" | "warning" | "info",
    duration?: number,
    zIndex?: number // z-index 추가
  ) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "warning" | "info";
    duration: number;
    zIndex?: number;
  } | null>(null);

  const showToast = useCallback(
    (
      message: string,
      type: "success" | "error" | "warning" | "info" = "success",
      duration: number = 2000,
      zIndex: number = 10
    ) => {
      setToast({ message, type, duration, zIndex });
    },
    []
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          zIndex={toast.zIndex}
          onClose={() => setToast(null)}
        />
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
