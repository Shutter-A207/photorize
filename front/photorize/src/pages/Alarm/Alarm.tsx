import React, { useState, useEffect } from "react";
import Header from "../../components/Common/Header";
import Footer from "../../components/Common/Footer";
import AlarmItem from "../../components/AlarmItem"; // AlarmItem 컴포넌트를 불러옵니다
import { fetchAlarms } from "../../api/AlarmAPI";

// Alarm 인터페이스 정의
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
  const [alarmData, setAlarmData] = useState<Alarm[]>([]); // alarmData 타입 지정

  useEffect(() => {
    const loadAlarms = async () => {
      try {
        const data = await fetchAlarms(0); // 첫 페이지의 알람 데이터를 불러옵니다.
        console.log(data);

        // data가 존재하고 content가 배열인지 확인 후 설정
        setAlarmData(data.content || []);
      } catch (error) {
        console.error("알람 데이터를 불러오는 중 오류 발생:", error);
      }
    };

    loadAlarms();
  }, []);

  const handleStatusChange = (alarmId: number) => {
    setAlarmData((prevData) =>
      prevData.filter((item) => item.alarmId !== alarmId)
    );
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
              profileImage={item.url} // 프로필 이미지 (예시)
              type={item.type === "PRIVATE" ? "일기" : "초대장"} // 타입을 텍스트로 변환
              inviter={item.type === "PUBLIC" ? item.inviter : undefined}
              inviteAlbum={item.type === "PUBLIC" ? item.albumName : undefined}
              sender={item.type === "PRIVATE" ? item.sender : undefined}
              diaryDate={
                item.type === "PRIVATE" ? item.date?.split("T")[0] : undefined
              } // 날짜 포맷 변환
              onStatusChange={() => handleStatusChange(item.alarmId)}
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
    </>
  );
};

export default Alarm;
