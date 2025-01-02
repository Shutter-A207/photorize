import { useState, useEffect } from "react";
import { DateValueType } from "react-tailwindcss-datepicker";
import { useNavigate } from "react-router-dom";
import { sendMemoryData } from "../../api/MemoryAPI";
import { useToast } from "../../components/Common/ToastProvider";

export interface Spot {
  id: number | null;
  name: string | null;
}

export interface User {
  id: number;
  name: string;
  privateAlbumId: number;
}

export interface Album {
  id: number | null;
  name: string | null;
  members: string[] | null;
}

export function useRecord() {
  const { showToast } = useToast();
  const navigate = useNavigate();

  // 공유 방식: "내 앨범" / "공유"
  const [shareSelection, setShareSelection] = useState<string>("내 앨범");
  // 날짜 (DatePicker)
  const [date, setDate] = useState<DateValueType>({ startDate: null, endDate: null });
  // 스팟 (SearchSpot)
  const [spot, setSpot] = useState<Spot>({ id: null, name: null });
  // 메모 (MemoInput)
  const [memo, setMemo] = useState<string>("");
  // 미디어 (사진/비디오)
  const [photo, setPhoto] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);

  // 공유 앨범 / 태그
  const [tags, setTags] = useState<User[]>([]);
  const [album, setAlbum] = useState<Album | null>(null);
  const [selectedPrivateAlbumIds, setSelectedPrivateAlbumIds] = useState<number[]>([]);

  // “개인 / 앨범” 선택
  const [selectedAlbum, setSelectedAlbum] = useState<string>("personal");

  // 버튼 활성화 여부
  const [isButtonEnabled, setIsButtonEnabled] = useState<boolean>(false);

  // 앨범 모달, 로딩
  const [isAlbumModalOpen, setIsAlbumModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 1) 마운트 시, 기존 사진/비디오 초기화(선택사항)
  useEffect(() => {
    setPhoto(null);
    setVideo(null);
  }, []);

  // 2) 태그된 유저들 → privateAlbumId 목록
  useEffect(() => {
    if (tags.length > 0) {
      const privateAlbumIds = tags.map((tag) => tag.privateAlbumId);
      setSelectedPrivateAlbumIds(privateAlbumIds);
    } else {
      setSelectedPrivateAlbumIds([]);
    }
  }, [tags]);

  // 3) 폼 유효성 검사 → 버튼 활성화
  useEffect(() => {
    const hasDate = date?.startDate !== null;
    const hasSpot = spot.id !== null;
    const hasMemo = memo.trim() !== "";
    const hasPhoto = photo !== null;
    const hasRequiredTag =
      shareSelection === "내 앨범" ||
      (shareSelection === "공유" && (tags.length > 0 || album !== null));

    setIsButtonEnabled(hasDate && hasSpot && hasMemo && hasPhoto && hasRequiredTag);
  }, [date, spot, memo, photo, tags, album, shareSelection]);

  // 4) 앨범 생성 모달 성공 시
  const handleModalSuccess = (newAlbum: Album) => {
    showToast("앨범 생성에 성공했습니다!", "success");
    setAlbum(newAlbum);
    setSelectedAlbum("album");
    setIsAlbumModalOpen(false);
  };

  // 5) 최종 등록
  const handleRegister = async () => {
    if (!date || !date.startDate || !isButtonEnabled || isLoading) return;

    const formattedDate = new Date(date.startDate).toISOString().split("T")[0];
    const memoryData = {
      date: formattedDate,
      spotId: spot.id!,
      content: memo,
      albumIds:
        shareSelection === "내 앨범"
          ? []
          : selectedAlbum === "personal"
          ? selectedPrivateAlbumIds
          : album
          ? [album.id!]
          : [],
      type:
        shareSelection !== "내 앨범" && selectedAlbum === "album"
          ? "PUBLIC"
          : "PRIVATE",
    };

    const formData = new FormData();
    formData.append(
      "memory",
      new Blob([JSON.stringify(memoryData)], { type: "application/json" })
    );
    if (photo) formData.append("photo", photo);
    if (video) formData.append("video", video);

    setIsLoading(true);
    try {
      await sendMemoryData(formData);
      showToast("추억이 성공적으로 등록되었습니다!", "success");
      navigate("/home");
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || "추억 등록 중 오류가 발생했습니다.";
      showToast(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // 상태
    shareSelection,
    setShareSelection,
    date,
    setDate,
    spot,
    setSpot,
    memo,
    setMemo,
    photo,
    setPhoto,
    video,
    setVideo,
    tags,
    setTags,
    album,
    setAlbum,
    selectedPrivateAlbumIds,
    isButtonEnabled,
    isAlbumModalOpen,
    setIsAlbumModalOpen,
    selectedAlbum,
    setSelectedAlbum,
    isLoading,
    // 함수
    handleModalSuccess,
    handleRegister,
  };
}
