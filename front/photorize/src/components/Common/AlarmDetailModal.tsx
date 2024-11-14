// AlarmDetailModal.tsx
import React from "react";
import ReactDOM from "react-dom";

interface AlarmDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  alarmDetail: {
    alarmType: "PUBLIC" | "PRIVATE";
    url: string | null;
    content: string | null;
    memberList: { nickname: string; img: string; status: boolean }[] | null;
  } | null;
}

const AlarmDetailModal: React.FC<AlarmDetailModalProps> = ({
  isOpen,
  onClose,
  alarmDetail,
}) => {
  if (!isOpen || !alarmDetail) return null;

  const renderPrivateContent = () => (
    <div>
      <h2 className="text-lg font-bold mb-4">알람 상세 정보 - 추억</h2>
      {alarmDetail.url && (
        <div className="mt-4">
          <img
            src={alarmDetail.url}
            alt="추억 이미지"
            className="w-full object-cover rounded-md"
          />
        </div>
      )}
      <p className="mt-2">내용 : {alarmDetail.content}</p>
    </div>
  );

  const renderPublicContent = () => (
    <div>
      <h2 className="text-lg font-bold mb-4">알람 상세 정보 - 공유 앨범</h2>
      <p>앨범 명단</p>
      <div className="mt-4">
        {(alarmDetail.memberList || []).map((member, index) => (
          <div key={index} className="flex items-center mt-2">
            <img
              src={member.img}
              alt={member.nickname}
              className="w-10 h-10 rounded-full"
            />
            <p className="ml-2">{member.nickname}</p>
            {member.status ? (
              <p className="ml-auto">수락</p>
            ) : (
              <p className="ml-auto">대기 중</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const modalContent = (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-md shadow-md w-96 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-lg font-bold"
        >
          &times;
        </button>
        {alarmDetail.alarmType === "PUBLIC"
          ? renderPublicContent()
          : renderPrivateContent()}
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default AlarmDetailModal;
