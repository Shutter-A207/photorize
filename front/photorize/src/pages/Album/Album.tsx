import React from "react";
import Header from "../../components/Common/Header";
import Footer from "../../components/Common/Footer";
import AlbumItem from "../../components/Common/AlbumItem";

interface AlbumData {
  id: number;
  name: string;
  color: string;
}

const Album = () => {
  const albumData: AlbumData[] = [
    { id: 1, name: "내 앨범", color: "#D9D9D9" },
    { id: 2, name: "Shutter", color: "#FF6B6B" },
    { id: 3, name: "99z", color: "#FF9900" },
    { id: 4, name: "하이파이브", color: "#FCF67D" },
  ];

  return (
    <div className="bg-[#F9F9F9] min-h-screen pt-14 pb-20">
      <Header title="앨범 목록" />
      <div className="flex justify-end mt-2 mr-4 space-x-2">
        <button className="px-4 py-1 text-white rounded bg-[#FF93A5]">
          추가
        </button>
        <button className="px-4 text-white rounded bg-[#8B8B8B]">편집</button>
      </div>
      <div className="grid grid-cols-3 gap-4 p-4">
        {albumData.map((album) => (
          <AlbumItem
            key={album.id}
            id={album.id}
            name={album.name}
            color={album.color}
          />
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default Album;
