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
      <div
        className="flex flex-col items-center p-3 rounded-lg shadow-lg w-[92px] h-[130px]"
        onClick={handleClick}
        style={{ backgroundColor: color }}
      >
        <div className="flex items-center justify-center w-[81px] h-[58px] bg-white rounded-lg">
          <p className="text-[#A0A0A0] text-ml font-black mb-3">Photorize</p>
        </div>
      </div>
      <p className="mt-2 text-center font-bold text-sm">{name}</p>
    </div>
  );
};

export default AlbumItem;
