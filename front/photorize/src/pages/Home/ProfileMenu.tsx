import React, { RefObject } from "react";

interface ProfileMenuProps {
  menuOpen: boolean;
  menuRef: RefObject<HTMLDivElement>;
  onCloseMenu: () => void;
  onEditProfile: () => void;
  onEditNickname: () => void;
  onLogout: () => void;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({
  menuOpen,
  menuRef,
  onCloseMenu,
  onEditProfile,
  onEditNickname,
  onLogout,
}) => {
  if (!menuOpen) return null;

  return (
    <div
      ref={menuRef}
      className="absolute top-11 left-0 bg-white shadow-lg rounded-md w-32 z-10 mt-2"
    >
      <button
        className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
        onClick={onEditProfile}
      >
        프로필 수정
      </button>
      <button
        className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
        onClick={() => {
          onEditNickname();
          onCloseMenu();
        }}
      >
        닉네임 수정
      </button>
      <button
        className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
        onClick={onLogout}
      >
        로그아웃
      </button>
    </div>
  );
};

export default ProfileMenu;
