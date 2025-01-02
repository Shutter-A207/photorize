// pages/Alarm/index.tsx
import React, { useState } from "react";
import Header from "../../components/Common/Header";
import Footer from "../../components/Common/Footer";
import SuccessAlert from "../../components/Common/SuccessAlert";
import FailAlert from "../../components/Common/FailAlert";
import { useLoading } from "../../components/Common/Loader/LoadingContext";
import AlarmList from "./AlarmList";
import { useAlarm } from "./useAlarm";

const Alarm: React.FC = () => {
  // 로딩 Context
  const { setIsLoading } = useLoading();

  // 커스텀 훅에서 알람 관련 로직 얻기
  const {
    alarmData,
    lastAlarmElementRef,
    handleStatusChange,
    isLoadingPage,
  } = useAlarm(setIsLoading);

  // 알림 모달 관련 상태
  const [isSuccessAlertOpen, setIsSuccessAlertOpen] = useState(false);
  const [isFailAlertOpen, setIsFailAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  // 성공/실패 알림 표시 함수
  const showSuccessAlert = (message: string) => {
    setAlertMessage(message);
    setIsSuccessAlertOpen(true);
  };
  const showFailAlert = (message: string) => {
    setAlertMessage(message);
    setIsFailAlertOpen(true);
  };

  return (
    <>
      <Header title="알림" />

      <div className="p-4 bg-[#F9F9F9] min-h-screen pt-20 pb-20">
        {/* 알람 리스트 */}
        <AlarmList
          alarmData={alarmData}
          lastAlarmElementRef={lastAlarmElementRef}
          onStatusChange={handleStatusChange}
          onShowSuccessAlert={showSuccessAlert}
          onShowFailAlert={showFailAlert}
        />

        {/* 추가 로딩 시 표시 */}
        {isLoadingPage && (
          <div className="flex justify-center py-4">
            <p className="text-gray-500">로딩 중...</p>
          </div>
        )}
      </div>

      <Footer />

      {/* 성공 알림 */}
      {isSuccessAlertOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <SuccessAlert
            message={alertMessage}
            onClose={() => setIsSuccessAlertOpen(false)}
          />
        </div>
      )}

      {/* 실패 알림 */}
      {isFailAlertOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <FailAlert
            message={alertMessage}
            onClose={() => setIsFailAlertOpen(false)}
          />
        </div>
      )}
    </>
  );
};

export default Alarm;
