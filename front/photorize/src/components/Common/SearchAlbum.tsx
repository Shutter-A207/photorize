import React, { useState } from "react";
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
}) => {
  const [keyword, setKeyword] = useState<string>("");
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isResultsVisible, setIsResultsVisible] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);

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
        setIsResultsVisible(true);
      }
    } catch (error) {
      console.error("앨범을 검색하는 중 오류가 발생했습니다:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleAlbumSelect = (album: Album) => {
    setSelectedAlbum(album);
    setIsResultsVisible(false);
    setKeyword("");
    onChange(album);
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="p-fluid">
        <div className="flex bg-white mb-4 rounded-lg pl-4 pr-4 pt-1 pb-1 w-full border border-[#B3B3B3]">
          {selectedAlbum ? (
            <div className="flex items-center flex-1">
              <img src={imageSrc} className="h-5" alt="spot icon" />
              <div className="pl-3 text-sm text-[#818181] ml-">
                {selectedAlbum.name}
              </div>
              <Button
                icon="pi pi-times"
                onClick={() => {
                  setSelectedAlbum(null);
                  setKeyword("");
                }}
                className="p-button-text p-button-rounded ml-auto"
              />
            </div>
          ) : (
            <>
              <div className="flex items-center">
                <img src={imageSrc} className="h-5" alt="spot icon" />
              </div>
              <InputText
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyPress={handleKeyPress}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={isFocused ? "" : placeholder}
                className="pl-1 text-sm border-none text-[#818181] placeholder-[#BCBFC3] placeholder:font-medium ml-2"
              />
              <Button
                icon="pi pi-search"
                onClick={handleSearch}
                disabled={loading}
                className="p-button-text p-button-rounded"
              />
            </>
          )}
        </div>
      </div>

      {isResultsVisible && keyword && (
        <div className="absolute w-full z-50 bg-white border border-[#B3B3B3] rounded-lg shadow-lg">
          <div className="max-h-60 overflow-y-auto">
            {albums.length > 0 ? (
              albums.map((album) => (
                <div
                  key={album.id}
                  className="flex items-center p-3 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleAlbumSelect(album)}
                >
                  <div className="text-sm text-[#818181]">
                    {album.name}
                    {album.members && album.members.length > 0 && (
                      <span className="ml-2 text-xs text-[#818181]">
                        ({album.members.join(", ")})
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-3 text-sm text-[#818181] text-center">
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
