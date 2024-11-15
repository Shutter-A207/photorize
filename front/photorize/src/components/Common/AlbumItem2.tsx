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
    // 기본값을 true로 설정
    const navigate = useNavigate();

    const handleClick = () => {
      if (isEditable) {
        navigate(`/album/${id}`);
      }
    };

    return (
      <div className="flex flex-col items-center" ref={ref}>
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
              <div className="absolute bottom-0 left-0 right-0 p-4 h-20 bg-white/30 flex items-center justify-center text-[#5C5C5C] text-base font-extrabold">
                {type === "PRIVATE" ? "My Album" : ""}
              </div>

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
  }
);

AlbumItem.displayName = "AlbumItem"; // for debugging purposes

export default AlbumItem;
