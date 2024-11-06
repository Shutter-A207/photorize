import React, { useState, useEffect } from "react";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { fetchSpots } from "../../api/AlbumAPI";

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
  const [spots, setSpots] = useState<Spot[]>([]);
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);

  const selectedSpotTemplate = (option: string) => {
    if (option) {
      return (
        <div className="flex align-items-center">
          <img src={imageSrc} className="h-5" />
          <div className="text-sm text-[#818181] ml-2">{option}</div>
        </div>
      );
    }

    return (
      <div className="flex align-items-center">
        <img src={imageSrc} className="h-5" />
        <span className="text-sm text-[#BCBFC3] ml-2">{placeholder}</span>
      </div>
    );
  };

  const spotOptionTemplate = (option: string) => {
    return (
      <div className="flex align-items-cente">
        <div className="text-sm text-[#818181] ml-2">{option}</div>
      </div>
    );
  };

  const handleDropdownChange = (e: DropdownChangeEvent) => {
    setSelectedSpot(e.value);
    onChange(e.value);
  };

  useEffect(() => {
    const loadColors = async () => {
      try {
        const response = await fetchSpots();
        if (response && response.status == 200) {
          console.log(response.data);
          const spotNames = response.data.map(
            (data: { spotName: string }) => data.spotName
          );
          setSpots(spotNames);
        }
      } catch (error) {
        console.error("스팟을 불러오는 중 오류가 발생했습니다:", error);
      }
    };
    loadColors();
  }, []);

  return (
    <Dropdown
      value={selectedSpot}
      onChange={handleDropdownChange}
      options={spots}
      placeholder={placeholder}
      filter
      valueTemplate={selectedSpotTemplate}
      itemTemplate={spotOptionTemplate}
      className="flex items-center bg-white rounded-lg p-2 w-full max-w-md mb-4 border border-[#B3B3B3] text-sm text-[#343434] outline-none"
    />
  );
};

export default SearchSpot;
