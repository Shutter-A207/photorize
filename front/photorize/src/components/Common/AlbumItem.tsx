import React, { forwardRef } from "react";
import { useNavigate } from "react-router-dom";

interface AlbumItemProps {
  id: number;
  name: string;
  color: string;
  type: string;
  isEditable: boolean;
}

const AlbumItem = forwardRef<HTMLDivElement, AlbumItemProps>(
  ({ id, name, color, type, isEditable = true }, ref) => {
    const navigate = useNavigate();

    const handleClick = () => {
      if (isEditable) {
        navigate(`/album/${id}`);
      }
    };

    return (
      <div
        className="flex flex-col items-center animate-wiggle"
        ref={ref}
        onClick={handleClick}
      >

        <div className="relative w-60 h-80 cursor-pointer hover:scale-105 transition-transform duration-300">
          {type === "PRIVATE" && (
            <img
              src="/assets/myAlbumIcon.png"
              alt="My Album Icon"
              className="absolute top-2 right-2 w-8 h-8"
            />
          )}
          <div className="absolute w-full h-full">
            {/* Front cover */}
            <div
              className="w-full h-full rounded-lg shadow-2xl"
              style={{ backgroundColor: color }}
            >
              <img
                src="/assets/Logo2.png"
                alt="Cover Logo"
                className="absolute top-8 left-1/2 -translate-x-1/2 w-32 h-32 object-contain"
              />
              {/* Cover content */}
              <div className="absolute bottom-0 left-0 right-0 p-4 h-24 bg-white/30 flex items-center justify-center text-[#5C5C5C] text-xl font-extrabold">
                {type === "PRIVATE" ? "My Album" : ""}
              </div>

              {/* Book spine shadow effect */}
              <div className="absolute top-0 bottom-0 left-[12px] w-[4px] bg-black/[0.1]" />
            </div>
          </div>

          {/* Back cover */}
          <div className="w-full h-full rounded-lg shadow-md"></div>
        </div>
        <p className="mt-4 text-center font-bold text-lg">{name}</p>
      </div>
    );
  }
);

AlbumItem.displayName = "AlbumItem";

export default AlbumItem;
