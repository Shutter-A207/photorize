import React, { useState, useEffect, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { fetchUsers } from "../../api/UserAPI";

interface User {
  id: number;
  name: string;
  privateAlbumId: number;
}

interface SearchTagProps {
  imageSrc: string;
  placeholder: string;
  onChange: (value: User[]) => void;
}

const SearchTag: React.FC<SearchTagProps> = ({
  imageSrc,
  placeholder,
  onChange,
}) => {
  const [keyword, setKeyword] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startX, setStartX] = useState<number>(0);
  const [scrollLeft, setScrollLeft] = useState<number>(0);
  const [shake, setShake] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        selectedUsers.length === 0
      ) {
        setIsSearchVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = async () => {
    if (!keyword.trim()) return;
    setLoading(true);
    try {
      const response = await fetchUsers(keyword);
      if (response) {
        console.log(response);
        const userData = response.data.map(
          (data: {
            memberId: number;
            nickname: string;
            privateAlbumId: number;
          }) => ({
            id: data.memberId,
            name: data.nickname,
            privateAlbumId: data.privateAlbumId,
          })
        );
        setUsers(userData);
        if (userData.length === 0) {
          triggerShake();
        }
      }
    } catch (error) {
      console.error("유저를 검색하는 중 오류가 발생했습니다:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelect = (user: User) => {
    if (!selectedUsers.some((selected) => selected.id === user.id)) {
      const updatedUsers = [user, ...selectedUsers];
      setSelectedUsers(updatedUsers);
      onChange(updatedUsers);
    }
    setKeyword("");
  };

  const handleRemoveUser = (memberId: number) => {
    const updateUsers = selectedUsers.filter((user) => user.id !== memberId);
    setSelectedUsers(updateUsers);
    onChange(updateUsers);
  };

  const openSearch = () => {
    if (!isSearchVisible) {
      setIsSearchVisible(true);
    }
  };

  const toggleSearch = () => {
    if (isSearchVisible) {
      setKeyword("");
      setUsers([]);
    }
    setIsSearchVisible(!isSearchVisible);
  };

  const triggerShake = () => {
    setShake(false);
    setTimeout(() => setShake(true), 0);
    setTimeout(() => setShake(false), 500);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - e.currentTarget.clientLeft);
    setScrollLeft(e.currentTarget.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const x = e.pageX - e.currentTarget.clientLeft;
    const walk = (x - startX) * 2;
    e.currentTarget.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      className="relative w-full max-w-md"
      ref={containerRef}
      onClick={openSearch}
    >
      <div className="flex items-center bg-white border border-[#B3B3B3] rounded-lg px-4 py-3">
        <img src={imageSrc} className="h-5 mr-2" alt="spot icon" />
        <div
          className="flex-1 flex items-center space-x-2 scrollbar-hidden whitespace-nowrap"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{ cursor: isDragging ? "grabbing" : "grab" }}
        >
          {selectedUsers.length > 0 ? (
            selectedUsers.map((user) => (
              <div
                key={user.id}
                className="flex y-2 items-center border rounded-full pl-3"
                style={{ borderColor: "#FF93A5" }}
              >
                <span className="text-sm text-[#818181] mr-1">{user.name}</span>
                <Button
                  icon="pi pi-times"
                  onClick={() => handleRemoveUser(user.id)}
                  className="p-button-text p-button-rounded p-button-sm"
                />
              </div>
            ))
          ) : (
            <span className="text-sm text-[#BCBFC3]">{placeholder}</span>
          )}
        </div>
        <Button
          icon={isSearchVisible ? "pi pi-chevron-up" : "pi pi-chevron-down"}
          onClick={toggleSearch}
          className="p-button-text p-button-rounded"
        />
      </div>

      {isSearchVisible && (
        <div className="absolute w-full z-50 bg-white border border-[#B3B3B3] rounded-lg shadow-lg">
          <div className="flex items-center p-2">
            <InputText
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              placeholder="닉네임을 검색해 주세요"
              className="flex-1 outline-none text-sm placeholder-[#BCBFC3] placeholder:font-medium"
            />
            <Button
              icon="pi pi-search"
              onClick={handleSearch}
              disabled={loading}
              className="p-button-text p-button-rounded"
            />
          </div>

          <div className="max-h-60 scrollbar-hidden">
            {users.length > 0 ? (
              users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center p-3 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleUserSelect(user)}
                >
                  <div className="text-sm text-[#818181]">{user.name}</div>
                </div>
              ))
            ) : (
              <div
                className={`p-3 text-sm text-[#818181] text-center ${
                  shake ? "shake" : ""
                }`}
              >
                검색 결과가 없습니다
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchTag;
