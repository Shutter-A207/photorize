import React from "react";
import { MemoryDetail } from "./useMemory";

interface MemoryDetailProps {
  memoryDetail: MemoryDetail;
  menuOpen: boolean;
  toggleMenu: () => void;
  onOpenDeleteModal: () => void;
  canManage: boolean; // 작성자 여부 판단
}

const MemoryDetailComponent: React.FC<MemoryDetailProps> = ({
  memoryDetail,
  menuOpen,
  toggleMenu,
  onOpenDeleteModal,
  canManage,
}) => {
  return (
    <div
      className="bg-white rounded-xl p-4 mb-4 relative"
      style={{ boxShadow: "0px 1px 1px rgba(0, 0, 0, 0.1)" }}
    >
      <div className="flex items-center mb-2">
        <img
          src={memoryDetail.writerImg}
          alt={memoryDetail.nickname}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="ml-3 w-full">
          <p className="font-bold text-[#343434]">{memoryDetail.nickname}</p>
          <div className="flex items-center justify-between font-bold text-xs text-[#A19791] w-full">
            <div className="flex items-center">
              <img
                src="/assets/locationIcon2.png"
                alt="location icon"
                className="w-[9.6px] h-[12px] mr-1"
              />
              <span>{memoryDetail.spotName}</span>
            </div>
            <span className="mr-1">{memoryDetail.date}</span>
          </div>
        </div>
        {/* 메뉴 아이콘 */}
        {canManage && (
          <div className="absolute top-4 right-5">
            <img
              src="/assets/listIcon.png"
              className="w-5 cursor-pointer"
              onClick={toggleMenu}
            />
            {menuOpen && (
              <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-md w-32">
                <button
                  className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                  onClick={onOpenDeleteModal}
                >
                  추억 삭제
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="border-t border-gray-200 mt-3 mb-4"></div>
      <p className="text-sm font-medium text-[#343434] p-2">
        {memoryDetail.content}
      </p>
    </div>
  );
};

export default MemoryDetailComponent;
