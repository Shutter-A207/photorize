import React, { useState, useEffect } from "react";
import Header from "../../components/Common/Header";
import Footer from "../../components/Common/Footer";
import AlarmItem from "../../components/AlarmItem";
import SuccessAlert from "../../components/Common/SuccessAlert";
import FailAlert from "../../components/Common/FailAlert";
import { fetchAlarms } from "../../api/AlarmAPI";
import { useLoading } from "../../components/Common/Loader/LoadingContext";

interface Alarm {
  alarmId: number;
  profileImage: string;
  url: string;
  type: "PRIVATE" | "PUBLIC";
  sender?: string;
  inviter?: string;
  albumName?: string;
  date?: string;
}

const Alarm: React.FC = () => {
  const [alarmData, setAlarmData] = useState<Alarm[]>([]);
  const [isSuccessAlertOpen, setIsSuccessAlertOpen] = useState(false);
  const [isFailAlertOpen, setIsFailAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const { setIsLoading } = useLoading();

  useEffect(() => {
    const loadAlarms = async () => {
      setIsLoading(true);
      try {
        const data = await fetchAlarms(0);
        setAlarmData(data.content || []);
      } catch (error) {
        console.error("알람 데이터를 불러오는 중 오류 발생:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAlarms();
  }, []);

  const handleStatusChange = (alarmId: number) => {
    setAlarmData((prevData) =>
      prevData.filter((item) => item.alarmId !== alarmId)
    );
  };

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
        {alarmData.length > 0 ? (
          alarmData.map((item) => (
            <AlarmItem
              key={item.alarmId}
              alarmId={item.alarmId}
              profileImage={item.url}
              type={item.type === "PRIVATE" ? "추억" : "앨범 초대장"}
              inviter={item.type === "PUBLIC" ? item.inviter : undefined}
              inviteAlbum={item.type === "PUBLIC" ? item.albumName : undefined}
              sender={item.type === "PRIVATE" ? item.sender : undefined}
              diaryDate={
                item.type === "PRIVATE" ? item.date?.split("T")[0] : undefined
              }
              onStatusChange={() => handleStatusChange(item.alarmId)}
              onShowSuccessAlert={showSuccessAlert}
              onShowFailAlert={showFailAlert}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center mt-32">
            <img
              src="/assets/no-notice.png"
              alt="No alarm"
              className="w-32 h-32 mb-4"
            />
            <p className="text-gray-500 text-base">새로운 알림이 없어요!</p>
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
