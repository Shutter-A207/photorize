import React, { useState } from "react";
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
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [spots, setSpots] = useState<Spot[]>([]);
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isResultsVisible, setIsResultsVisible] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    try {
      const response = await fetchSpots(searchTerm);
      if (response) {
        console.log(response);
        const spotData = response.map(
          (data: { spotId: number; spotName: string }) => ({
            id: data.spotId,
            name: data.spotName,
          })
        );
        setSpots(spotData);
        setIsResultsVisible(true);
      }
    } catch (error) {
      console.error("스팟을 검색하는 중 오류가 발생했습니다:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSpotSelect = (spot: Spot) => {
    setSelectedSpot(spot);
    setIsResultsVisible(false);
    setSearchTerm("");
    onChange(spot);
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="p-fluid">
        <div className="flex bg-white mb-4 rounded-lg px-4 py-3 w-full border border-[#B3B3B3]">
          {selectedSpot ? (
            <div className="flex items-center flex-1">
              <img src={imageSrc} className="h-5" alt="spot icon" />
              <div className="pl-3 text-sm text-[#818181] ml-">
                {selectedSpot.name}
              </div>
              <Button
                icon="pi pi-times"
                onClick={() => {
                  setSelectedSpot(null);
                  setSearchTerm("");
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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

      {isResultsVisible && searchTerm && (
        <div className="absolute w-full z-50 bg-white border border-[#B3B3B3] rounded-lg shadow-lg">
          <div className="max-h-60 overflow-y-auto">
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

export default SearchSpot;
