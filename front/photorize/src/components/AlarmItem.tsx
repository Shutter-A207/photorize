import React from "react";

interface AlarmItemProps {
  profileImage: string;
  type: "초대장" | "일기";
  inviter?: string;
  inviteAlbum?: string;
  sender?: string;
  diaryDate?: string;
}

const AlarmItem: React.FC<AlarmItemProps> = ({
  profileImage,
  type,
  inviter,
  inviteAlbum,
  sender,
  diaryDate,
}) => {
  return (
    <div
      className="flex items-center bg-white rounded-lg pl-4 pr-4 pt-3 pb-3 mb-4"
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
        {type === "초대장" ? (
          <p className="text-xs font-semibold text-[#818181]">
            초대자: {inviter} <br />
            초대 앨범: {inviteAlbum}
          </p>
        ) : (
          <p className="text-xs font-semibold text-[#818181]">
            보낸이: {sender} <br />
            일기: {diaryDate}
          </p>
        )}
      </div>
      <div className="flex space-x-2">
        <button className="border border-[#FF93A5] bg-[#FFFFFF] rounded w-10 h-10 flex items-center justify-center">
          <img src="/assets/checkIcon.png" className="w-4" />
        </button>
        <button className="border border-[#ADADAD] text-gray-500 rounded w-10 h-10 flex items-center justify-center">
          <img src="/assets/XIcon.png" className="w-3" />
        </button>
      </div>
    </div>
  );
};

export default AlarmItem;
