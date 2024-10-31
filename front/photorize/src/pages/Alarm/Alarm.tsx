import React from "react";
import Header from "../../components/Common/Header";
import Footer from "../../components/Common/Footer";
import AlarmItem from "../../components/AlarmItem"; // AlarmItem 컴포넌트를 불러옵니다

const alarmData = [
  {
    profileImage: "/assets/test/member1.png",
    type: "초대장",
    inviter: "조수연",
    inviteAlbum: "99z",
  },
  {
    profileImage: "/assets/test/member1.png",
    type: "일기",
    sender: "조수연",
    diaryDate: "2024-10-12",
  },
  {
    profileImage: "/assets/test/member1.png",
    type: "초대장",
    inviter: "조수연",
    inviteAlbum: "99z",
  },
];

const Alarm: React.FC = () => {
  return (
    <>
      <Header title="알림" />
      <div className="p-4 bg-[#F9F9F9] min-h-screen pt-20 pb-20">
        {alarmData.map((item, index) => (
          <AlarmItem
            key={index}
            profileImage={item.profileImage}
            type={item.type as "초대장" | "일기"}
            inviter={item.inviter}
            inviteAlbum={item.inviteAlbum}
            sender={item.sender}
            diaryDate={item.diaryDate}
          />
        ))}
      </div>
      <Footer />
    </>
  );
};

export default Alarm;
