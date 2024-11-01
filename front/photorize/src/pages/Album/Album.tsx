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
    { id: 1, name: "내 앨범", color: "#f16f74" },
    { id: 2, name: "Shutter", color: "#ff924a" },
    { id: 3, name: "99z", color: "#f4d35e" },
    { id: 4, name: "하이파이브", color: "#a4c19e" },
    { id: 5, name: "하이파이브", color: "#4A90E2" },
    { id: 6, name: "하이파이브", color: "#425577" },
    { id: 7, name: "하이파이브", color: "#835f94" },
    { id: 8, name: "하이파이브", color: "#f78fb3" },
    { id: 9, name: "하이파이브", color: "#a6d5ff" },
    { id: 10, name: "하이파이브", color: "#b0b0b0" },
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
      <div className="grid grid-cols-2 gap-3 p-4">
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
