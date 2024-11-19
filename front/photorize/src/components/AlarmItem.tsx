import React, { useState } from "react";
import { updateAlarmStatus, fetchAlarmDetail } from "../api/AlarmAPI";
import AlarmDetailModal from "./Common/AlarmDetailModal";

interface AlarmItemProps {
  alarmId: number;
  profileImage: string;
  type: "추억" | "앨범 초대장";
  inviter?: string;
  inviteAlbum?: string;
  sender?: string;
  diaryDate?: string;
  onStatusChange?: () => void;
  onShowSuccessAlert: (message: string) => void;
  onShowFailAlert: (message: string) => void;
}

const AlarmItem: React.FC<AlarmItemProps> = ({
  alarmId,
  profileImage,
  type,
  inviter,
  inviteAlbum,
  sender,
  diaryDate,
  onStatusChange,
  onShowSuccessAlert,
  onShowFailAlert,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alarmDetail, setAlarmDetail] = useState(null);

  const openDetailModal = async () => {
    try {
      const data = await fetchAlarmDetail(alarmId); // Fetch alarm details
      setAlarmDetail(data);
      setIsModalOpen(true); // Open the modal
    } catch (error) {
      console.error("알람 상세 조회 중 오류 발생:", error);
    }
  };

  const handleAccept = async () => {
    try {
      await updateAlarmStatus(alarmId, true);
      if (onStatusChange) onStatusChange();

      // 성공 알림 설정
      const message =
        type === "추억"
          ? "개인 앨범에 추억이 추가되었어요."
          : `공유 앨범의 초대를 수락했어요.`;
      onShowSuccessAlert(message);
    } catch (error) {
      console.error("알람 수락 중 오류 발생:", error);
    }
  };

  const handleReject = async () => {
    try {
      await updateAlarmStatus(alarmId, false);
      if (onStatusChange) onStatusChange();

      // 실패 알림 설정
      const message =
        type === "추억"
          ? "추억을 거절했어요."
          : `공유 앨범의 초대를 거절했어요.`;
      onShowFailAlert(message);
    } catch (error) {
      console.error("알람 거절 중 오류 발생:", error);
    }
  };

  return (
    <>
      <div
        className="flex items-center bg-white rounded-lg pl-4 pr-4 pt-3 pb-3 mb-4 cursor-pointer"
        onClick={openDetailModal} // Open modal on click
        style={{
          boxShadow: "0px 2px 2px rgba(0, 0, 0, 0.25)",
        }}
      >
        <img
          src={profileImage}
          alt="Profile"
          className="w-12 h-12 rounded-full object-cover mr-6"
        />
        <div className="flex-1">
          <p className="font-bold text-[#343434]">{type}이 도착했어요.</p>
          {type === "앨범 초대장" ? (
            <p className="text-xs font-semibold text-[#818181]">
              초대자: {inviter} <br />
              초대 앨범: {inviteAlbum}
            </p>
          ) : (
            <p className="text-xs font-semibold text-[#818181]">
              보낸이: {sender} <br />
              날짜: {diaryDate}
            </p>
          )}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent modal from opening
              handleAccept();
            }}
            className="border border-[#FF93A5] bg-[#FFFFFF] rounded w-10 h-10 flex items-center justify-center"
          >
            <img src="/assets/checkIcon.png" className="w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent modal from opening
              handleReject();
            }}
            className="border border-[#ADADAD] text-gray-500 rounded w-10 h-10 flex items-center justify-center"
          >
            <img src="/assets/XIcon.png" className="w-3" />
          </button>
        </div>
      </div>

      {/* Render Alarm Detail Modal */}
      <AlarmDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        alarmDetail={alarmDetail}
      />
    </>
  );
};

export default AlarmItem;
