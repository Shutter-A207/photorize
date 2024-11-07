import React, { useState } from "react";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";

interface SearchProps {
  imageSrc: string;
  placeholder: string;
  onChange: (value: string) => void;
}

export default function Search({
  imageSrc,
  placeholder,
  onChange,
}: SearchProps) {
  const spots: string[] = ["Shutter", "99즈"];
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);

  const selectedAlbumTemplate = (option: string) => {
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

  const albumOptionTemplate = (option: string) => {
    return (
      <div className="flex align-items-cente">
        <div className="text-sm text-[#818181] ml-2">{option}</div>
      </div>
    );
  };

  const handleDropdownChange = (e: DropdownChangeEvent) => {
    setSelectedAlbum(e.value);
    onChange(e.value);
  };

  return (
    <Dropdown
      value={selectedAlbum}
      onChange={handleDropdownChange}
      options={spots}
      placeholder={placeholder}
      filter
      valueTemplate={selectedAlbumTemplate}
      itemTemplate={albumOptionTemplate}
      className="flex items-center bg-white rounded-lg p-2 w-full max-w-md mb-4 border border-[#B3B3B3] text-sm text-[#343434] outline-none"
    />
  );
}
