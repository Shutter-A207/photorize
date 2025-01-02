import React from "react";
import AlbumItem2 from "../../components/Common/AlbumItem2";
import { AlbumData } from "./useAlbumEdit"; // import from the hook file

interface AlbumEditListProps {
  albums: AlbumData[];
  lastAlbumElementRef: (node: HTMLDivElement | null) => void;
  onEditAlbumClick: (album: AlbumData) => void;
  onDeleteButtonClick: (albumId: number) => void;
}

const AlbumEditList: React.FC<AlbumEditListProps> = ({
  albums,
  lastAlbumElementRef,
  onEditAlbumClick,
  onDeleteButtonClick,
}) => {
  return (
    <div className="grid grid-cols-2 gap-3 p-4">
      {albums.map((album, index) => (
        <div
          key={album.albumId}
          className="relative"
          onClick={() => onEditAlbumClick(album)}
        >
          <AlbumItem2
            id={album.albumId}
            name={album.name}
            color={album.colorCode}
            type={album.type}       // 꼭 필요한 경우 넘기기
            isEditable={false}
            // “마지막 아이템”만 ref 연결
            ref={index === albums.length - 1 ? lastAlbumElementRef : null}
          />
          {album.type !== "PRIVATE" && (
            <button
              onClick={(e) => {
                e.stopPropagation(); // 부모 onClick 방지
                onDeleteButtonClick(album.albumId);
              }}
              className="absolute top-1 right-2 rounded-full w-6 h-6 flex items-center justify-center"
            >
              <img
                src="/assets/remove-icon.png"
                alt="Remove icon"
                className="w-5 h-5"
              />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default AlbumEditList;
