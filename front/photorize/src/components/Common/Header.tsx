import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleNotificationClick = () => {
    navigate("/notifications");
  };

  return (
    <header className="fixed max-w-sm mx-auto top-0 left-0 right-0  flex items-center justify-between p-4 bg-[#F9F9F9] shadow z-10">
      <div className="flex items-center">
        {location.pathname === "/home" ? (
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
      <h1 className="absolute left-1/2 transform -translate-x-1/2 text-lg font-semibold">
        {title}
      </h1>
      {location.pathname !== "/notifications" && (
        <img
          src="/assets/notification-icon.png"
          alt="Notification Icon"
          onClick={handleNotificationClick}
          className="h-6"
        />
      )}
    </header>
  );
};

export default Header;
