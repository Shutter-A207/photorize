import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getIconSrc = (path: string, iconName: string) =>
    location.pathname === path
      ? `/assets/${iconName}-active.png`
      : `/assets/${iconName}.png`;

  const getColor = (path: string) =>
    location.pathname === path ? "#FF93A5" : "#4D4D4D";

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white shadow-md flex justify-between items-center px-7 py-3 rounded-t-3xl">
      <div className="flex space-x-8">
        {/* Home */}
        <div
          className="flex flex-col items-center"
          onClick={() => navigate("/home")}
        >
          <img
            src={getIconSrc("/home", "home-icon")}
            alt="Home Icon"
            className="h-6"
          />
          <span
            className="text-sm suit-font-bold"
            style={{
              color: getColor("/home"),
            }}
          >
            홈
          </span>
        </div>

        {/* Album */}
        <div
          className="flex flex-col items-center"
          onClick={() => navigate("/album")}
        >
          <img
            src={getIconSrc("/album", "album-icon")}
            alt="Album Icon"
            className="h-6"
          />
          <span
            className="text-sm suit-font-bold"
            style={{
              color: getColor("/album"),
            }}
          >
            앨범 목록
          </span>
        </div>
      </div>

      {/*Record 버튼 */}
      <div
        className="absolute -top-6 left-1/2 transform -translate-x-1/2 flex items-center justify-center bg-[#FF93A5] rounded-full w-16 h-16 cursor-pointer shadow-lg"
        onClick={() => navigate("/record")}
      >
        <img
          src="/assets/record-icon.png"
          alt="Record Icon"
          className="h-8 w-8 text-white"
        />
      </div>

      <div className="flex space-x-8">
        {/* Pose */}
        <div
          className="flex flex-col items-center"
          onClick={() => navigate("/pose")}
        >
          <img
            src={getIconSrc("/pose", "pose-icon")}
            alt="Pose Icon"
            className="h-6"
          />
          <span
            className="text-sm suit-font-bold"
            style={{
              color: getColor("/pose"),
            }}
          >
            포즈
          </span>
        </div>

        {/* Spot */}
        <div
          className="flex flex-col items-center"
          onClick={() => navigate("/spot")}
        >
          <img
            src={getIconSrc("/spot", "spot-icon")}
            alt="Spot Icon"
            className="h-6"
          />
          <span
            className="text-sm suit-font-bold"
            style={{
              color: getColor("/spot"),
            }}
          >
            네컷 스팟
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
