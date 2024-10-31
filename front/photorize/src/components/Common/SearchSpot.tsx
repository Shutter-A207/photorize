import React, { useState } from "react";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";

interface SearchProps {
  imageSrc: string;
  placeholder: string;
}

export default function Search({ imageSrc, placeholder }: SearchProps) {
  const spots: string[] = [
    "인생네컷 강남점",
    "인생네컷 홍대점",
    "포토이즘 홍대점",
  ];

  const [selectedSpot, setSelectedSpot] = useState<string | null>(null);

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

  return (
    <Dropdown
      value={selectedSpot}
      onChange={(e: DropdownChangeEvent) => setSelectedSpot(e.value)}
      options={spots}
      placeholder={placeholder}
      filter
      valueTemplate={selectedSpotTemplate}
      itemTemplate={spotOptionTemplate}
      className="flex items-center bg-white rounded-lg p-2 w-full max-w-md mb-4 border border-[#B3B3B3] text-sm text-[#343434] outline-none"
    />
  );
}
