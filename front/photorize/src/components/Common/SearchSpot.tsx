import React, { useState, useEffect, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { fetchSpots } from "../../api/SpotAPI";

interface Spot {
  id: number | null;
  name: string | null;
}

interface SearchSpotProps {
  imageSrc: string;
  placeholder: string;
  onChange: (value: Spot) => void;
  selectedSpot: Spot | null;
}

const SearchSpot: React.FC<SearchSpotProps> = ({
  imageSrc,
  placeholder,
  onChange,
}) => {
  const [keyword, setKeyword] = useState<string>("");
  const [spots, setSpots] = useState<Spot[]>([]);
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);
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

  const handleSearch = async () => {
    if (!keyword.trim()) return;
    setLoading(true);
    try {
      const response = await fetchSpots(keyword);
      if (response) {
        const spotData = response.map(
          (data: { spotId: number; spotName: string }) => ({
            id: data.spotId,
            name: data.spotName,
          })
        );
        setSpots(spotData);
        if (spotData.length === 0) {
          triggerShake();
        }
      }
    } catch (error) {
      console.error("스팟을 검색하는 중 오류가 발생했습니다:", error);
    } finally {
      setLoading(false);
    }
  };

  const triggerShake = () => {
    setShake(false);
    setTimeout(() => setShake(true), 0);
    setTimeout(() => setShake(false), 500);
  };

  const handleSpotSelect = (spot: Spot) => {
    setSelectedSpot(spot);
    onChange(spot);
    setKeyword("");
    setIsSearchVisible(false);
    setSpots([]);
  };

  const openSearch = () => {
    if (!isSearchVisible) {
      setIsSearchVisible(true);
    }
  };

  const toggleSearch = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (isSearchVisible) {
      setKeyword("");
      setSpots([]);
    }
    setIsSearchVisible((prev) => !prev);
  };

  return (
    <div
      className="relative w-full max-w-md"
      ref={containerRef}
      onClick={openSearch}
    >
      <div className="flex items-center bg-white border border-[#B3B3B3] rounded-lg px-4 py-3">
        <img src={imageSrc} className="h-5 mr-2" alt="spot icon" />
        <div className="flex-1 flex items-center">
          {selectedSpot ? (
            <div className="flex items-center border-nene flex-1">
              <span className="text-sm text-[#818181]">
                {selectedSpot.name}
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

      {isSearchVisible && (
        <div className="absolute w-full z-50 bg-white border border-[#B3B3B3] rounded-lg shadow-lg">
          <div className="flex items-center p-2">
            <InputText
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              placeholder="지점명을 검색해 주세요"
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
            {spots.length > 0 ? (
              spots.map((spot) => (
                <div
                  key={spot.id}
                  className="flex items-center p-3 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSpotSelect(spot)}
                >
                  <div className="text-sm text-[#818181]">{spot.name}</div>
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

export default SearchSpot;
