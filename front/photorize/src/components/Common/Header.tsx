import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchAlarms } from "../../api/AlarmAPI";

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [hasUnreadAlarms, setHasUnreadAlarms] = useState(false);

  useEffect(() => {
    const checkAlarms = async () => {
      try {
        const alarms = await fetchAlarms();
        setHasUnreadAlarms(alarms?.content?.length > 0); // 알람이 있으면 빨간 점 표시
      } catch (error) {
        console.error("알람 조회 오류:", error);
      }
    };
    checkAlarms();
  }, []);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleNotificationClick = () => {
    navigate("/notifications");
  };

  return (
    <header className="fixed max-w-lg mx-auto top-0 left-0 right-0  flex items-center justify-between p-4 bg-[#F9F9F9] shadow z-20">
      <div className="flex items-center">
        {location.pathname === "/home" || location.pathname === "/home2" ? (
          <img src="/assets/Logo1.png" alt="Photorize Logo" className="h-4" />
        ) : (
          <img
            src="/assets/back-icon.png"
            alt="Back Icon"
            onClick={handleBackClick}
            className="h-6"
          />
        )}
      </div>
      <h1 className="absolute left-1/2 transform -translate-x-1/2 text-lg font-semibold truncate max-w-[60%] text-center whitespace-nowrap overflow-hidden text-ellipsis">
        {title}
      </h1>
      {location.pathname !== "/notifications" &&
        location.pathname !== "/register" && (
          <div className="relative">
            <img
              src="/assets/notification-icon.png"
              alt="Notification Icon"
              onClick={handleNotificationClick}
              className="h-6 cursor-pointer"
            />
            {/* 알람이 있는 경우 빨간 점 표시 */}
            {hasUnreadAlarms && (
              <span className="absolute bottom-4 left-[13px] h-[12px] w-[12px] bg-red-500 rounded-full" />
            )}
          </div>
        )}
    </header>
  );
};

export default Header;
