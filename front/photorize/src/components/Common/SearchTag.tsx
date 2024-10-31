import React, { useState } from "react";
import { MultiSelect, MultiSelectChangeEvent } from "primereact/multiselect";

interface SearchTagProps {
  imageSrc: string;
  placeholder: string;
}

export default function SearchTag({ imageSrc, placeholder }: SearchTagProps) {
  const tags: string[] = ["킹율", "한교동", "뽀로로"];
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const tagOptionTemplate = (option: string) => (
    <div className="flex align-items-center">
      <div className="text-sm text-[#818181] ml-2">{option}</div>
    </div>
  );

  return (
    <div className="relative w-full max-w-md mb-4">
      <MultiSelect
        value={selectedTags}
        onChange={(e: MultiSelectChangeEvent) => setSelectedTags(e.value)}
        options={tags}
        filter
        display="chip"
        itemTemplate={tagOptionTemplate}
        className="flex items-center bg-white rounded-lg p-2 w-full border border-[#B3B3B3] text-sm text-[#343434] outline-none"
        placeholder=""
      />
      {selectedTags.length === 0 && (
        <div className="absolute inset-0 flex items-center pl-2 pointer-events-none">
          <img src={imageSrc} alt="icon" className="w-4 h-4 mr-2" />
          <span className="text-sm text-[#BCBFC3] ml-2">{placeholder}</span>
        </div>
      )}
    </div>
  );
}