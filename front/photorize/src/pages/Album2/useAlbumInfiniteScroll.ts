import { useState, useRef, useCallback, useEffect } from "react";
import { fetchAlbums } from "../../api/AlbumAPI";
import { useLoading } from "../../components/Common/Loader/LoadingContext";

export interface AlbumData {
  albumId: number;
  name: string;
  type: string;
  colorId: number;
  colorCode: string;
}

export function useAlbumInfiniteScroll() {
  const [albums, setAlbums] = useState<AlbumData[]>([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [hasNext, setHasNext] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const { setIsLoading } = useLoading();

  // 앨범 목록 불러오기
  const loadAlbums = useCallback(async () => {
    // 첫 로딩일 경우만 전역 로딩 표시
    if (isInitialLoading) {
      setIsLoading(true);
    }
    if (!hasNext) return;

    try {
      const response = await fetchAlbums(pageNumber);
      if (response && response.status === 200) {
        setAlbums((prev) => [...prev, ...response.data.content]);
        setHasNext(response.data.hasNext);
      }
    } catch (error) {
      console.error("앨범 목록을 가져오는 중 오류가 발생했습니다.", error);
    } finally {
      setIsLoading(false);
      setIsInitialLoading(false);
    }
  }, [pageNumber, hasNext, isInitialLoading, setIsLoading]);

  // 페이지나 파라미터 변경 시마다 앨범 로드
  useEffect(() => {
    loadAlbums();
  }, [pageNumber, loadAlbums]);

  // 무한 스크롤 IntersectionObserver
  const lastAlbumElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNext) {
          setPageNumber((prev) => prev + 1);
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [hasNext]
  );

  return {
    albums,
    lastAlbumElementRef,
    isInitialLoading,
    hasNext,
    setAlbums,
  };
}
