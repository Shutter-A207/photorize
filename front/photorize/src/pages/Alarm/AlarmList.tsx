// pages/Alarm/AlarmList.tsx
import React from "react";
import AlarmItem from "../../components/AlarmItem";
import { Alarm } from "./useAlarm";

interface AlarmListProps {
  alarmData: Alarm[];
  lastAlarmElementRef: (node: HTMLDivElement | null) => void;
  onStatusChange: (alarmId: number) => void;
  onShowSuccessAlert: (message: string) => void;
  onShowFailAlert: (message: string) => void;
}

const AlarmList: React.FC<AlarmListProps> = ({
  alarmData,
  lastAlarmElementRef,
  onStatusChange,
  onShowSuccessAlert,
  onShowFailAlert,
}) => {
  if (alarmData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center mt-32">
        <img
          src="/assets/no-notice.png"
          alt="No alarm"
          className="w-32 h-32 mb-4"
        />
        <p className="text-gray-500 text-base">새로운 알림이 없어요!</p>
      </div>
    );
  }

  return (
    <>
      {alarmData.map((item, index) => {
        const isLastElement = index === alarmData.length - 1;

        return (
          <div
            key={item.alarmId}
            ref={isLastElement ? lastAlarmElementRef : null}
          >
            <AlarmItem
              alarmId={item.alarmId}
              profileImage={item.profileImage} // 혹은 item.url?
              type={item.type === "PRIVATE" ? "추억" : "앨범 초대장"}
              inviter={item.type === "PUBLIC" ? item.inviter : undefined}
              inviteAlbum={item.type === "PUBLIC" ? item.albumName : undefined}
              sender={item.type === "PRIVATE" ? item.sender : undefined}
              diaryDate={
                item.type === "PRIVATE" ? item.date?.split("T")[0] : undefined
              }
              onStatusChange={() => onStatusChange(item.alarmId)}
              onShowSuccessAlert={onShowSuccessAlert}
              onShowFailAlert={onShowFailAlert}
            />
          </div>
        );
      })}
    </>
  );
};

export default AlarmList;
