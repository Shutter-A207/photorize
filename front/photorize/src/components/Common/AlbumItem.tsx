import React from "react";
import { useNavigate } from "react-router-dom";

interface AlbumItemProps {
  id: number;
  name: string;
  color: string;
}

const AlbumItem: React.FC<AlbumItemProps> = ({ id, name, color }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/album/${id}`);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-40 h-52" onClick={handleClick}>
        <div className="absolute w-full h-full">
          {/* Front cover */}
          <div
            className="w-full h-full rounded-r-sm shadow-[inset_4px_0_10px_rgba(0,0,0,0.1)]"
            style={{ backgroundColor: color }}
          >
            <img
              src="/assets/Logo2.png"
              alt="Cover Logo"
              className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-24 object-contain"
            />
            {/* Cover content */}
            <div className="absolute bottom-0 left-0 right-0 p-8 h-12 bg-white/20"></div>

            {/* Book spine shadow effect */}
            <div className="absolute top-0 bottom-0 left-[10px] w-[3px] bg-black/[0.06]" />
          </div>
        </div>

        {/* Back cover */}
        <div className="w-full h-full shadow-lg rounded-l-sm"></div>
      </div>
      <p className="mt-2 text-center font-bold text-sm">{name}</p>
    </div>
  );
};

export default AlbumItem;
