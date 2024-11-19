import React, { useState, useEffect, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { searchAlbums } from "../../api/AlbumAPI";

interface Album {
  id: number | null;
  name: string | null;
  members: string[] | null;
}

interface SearchAlbumProps {
  imageSrc: string;
  placeholder: string;
  onChange: (value: Album) => void;
  selectedAlbum: Album | null;
}

const SearchAlbum: React.FC<SearchAlbumProps> = ({
  imageSrc,
  placeholder,
  onChange,
  selectedAlbum: externalSelectedAlbum,
}) => {
  const [keyword, setKeyword] = useState<string>("");
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(
    externalSelectedAlbum
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false);
  const [shake, setShake] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsSearchVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setSelectedAlbum(externalSelectedAlbum);
  }, [externalSelectedAlbum]);

  const handleSearch = async () => {
    if (!keyword.trim()) return;

    setLoading(true);
    try {
      const response = await searchAlbums(keyword);
      if (response) {
        const albumData = response.data.map(
          (data: { albumId: number; name: string; memberList: string[] }) => ({
            id: data.albumId,
            name: data.name,
            members: data.memberList,
          })
        );
        setAlbums(albumData);
        if (albumData.length === 0) {
          triggerShake();
        }
      }
    } catch (error) {
      console.error("앨범을 검색하는 중 오류가 발생했습니다:", error);
    } finally {
      setLoading(false);
    }
  };

  const triggerShake = () => {
    setShake(false);
    setTimeout(() => setShake(true), 0);
    setTimeout(() => setShake(false), 500);
  };

  const handleAlbumSelect = (album: Album) => {
    setSelectedAlbum(album);
    onChange(album);
    setKeyword(""); // 검색어 초기화
    setAlbums([]); // 검색 결과 초기화
    setIsSearchVisible(false); // 검색창 닫기
  };

  const openSearch = () => {
    if (!isSearchVisible) {
      setIsSearchVisible(true);
    }
  };

  const toggleSearch = () => {
    if (isSearchVisible) {
      setKeyword("");
      setAlbums([]);
    }
    setIsSearchVisible(!isSearchVisible);
  };

  return (
    <div
      className="relative w-full max-w-md"
      ref={containerRef}
      onClick={openSearch}
    >
      {/* Input Section */}
      <div className="flex items-center bg-white border border-[#B3B3B3] rounded-lg px-4 py-3">
        <img src={imageSrc} className="h-7 mr-2" alt="album icon" />
        <div className="flex-1 flex items-center">
          {selectedAlbum ? (
            <div className="flex items-center flex-1">
              <span className="text-sm text-[#818181]">
                {selectedAlbum.name}
              </span>
            </div>
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

      {/* Search Results Dropdown */}
      {isSearchVisible && (
        <div className="absolute w-full z-50 bg-white border border-[#B3B3B3] rounded-lg shadow-lg">
          <div className="flex items-center p-2">
            <InputText
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              placeholder="앨범명 및 닉네임을 검색해 주세요"
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
            {albums.length > 0 ? (
              albums.map((album) => (
                <div
                  key={album.id}
                  className="flex items-center p-3 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleAlbumSelect(album)}
                >
                  <span className="text-sm text-[#818181]">
                    {album.name}
                    {album.members && album.members.length > 0 && (
                      <span className="ml-2 text-xs text-[#818181]">
                        ({album.members.join(", ")})
                      </span>
                    )}
                  </span>
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

export default SearchAlbum;
