import React from "react";
import AlbumItem2 from "../../components/Common/AlbumItem2";
import { AlbumData } from "./useAlbumInfiniteScroll";

interface AlbumListProps {
  albums: AlbumData[];
  lastAlbumElementRef: (node: HTMLDivElement | null) => void;
}

const AlbumList: React.FC<AlbumListProps> = ({ albums, lastAlbumElementRef }) => {
  return (
    <div className="grid grid-cols-2 gap-3 p-4">
      {albums.map((album, index) => {
        const isLast = index === albums.length - 1;
        return (
          <AlbumItem2
            key={album.albumId}
            id={album.albumId}
            name={album.name}
            color={album.colorCode}
            type={album.type}
            isEditable={true}
            ref={isLast ? lastAlbumElementRef : null}
          />
        );
      })}
    </div>
  );
};

export default AlbumList;
