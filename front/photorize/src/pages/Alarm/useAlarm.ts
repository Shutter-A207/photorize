import { useState, useEffect, useCallback, useRef } from "react";
import { fetchAlarms } from "../../api/AlarmAPI";

export interface Alarm {
  alarmId: number;
  profileImage: string;
  url: string;
  type: "PRIVATE" | "PUBLIC";
  sender?: string;
  inviter?: string;
  albumName?: string;
  date?: string;
}

interface FetchAlarmsResponse {
  content?: Alarm[];
  last: boolean;
  // 필요한 필드들이 있다면 추가
}

export function useAlarm(setIsLoading: (flag: boolean) => void) {
  // 알람 데이터
  const [alarmData, setAlarmData] = useState<Alarm[]>([]);
  // 현재 페이지, 더 로드할지 여부, 로딩 상태
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingPage, setIsLoadingPage] = useState(false);

  // 무한 스크롤 관찰자
  const observerRef = useRef<IntersectionObserver | null>(null);

  // 최초 데이터 로드
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        const data: FetchAlarmsResponse = await fetchAlarms(0);
        setAlarmData(data.content || []);
        setHasMore(!data.last);
        setCurrentPage(0);
      } catch (error) {
        console.error("알람 데이터를 불러오는 중 오류 발생:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [setIsLoading]);

  // 추가 데이터 로드
  const loadMoreAlarms = async (pageNumber: number) => {
    if (isLoadingPage || !hasMore) return;

    setIsLoadingPage(true);
    try {
      const data: FetchAlarmsResponse = await fetchAlarms(pageNumber);
      setAlarmData((prev) => [...prev, ...(data.content || [])]);
      setHasMore(!data.last);
    } catch (error) {
      console.error("알람 데이터를 추가 로드하는 중 오류 발생:", error);
    } finally {
      setIsLoadingPage(false);
    }
  };

  // 마지막 요소에 대한 ref 콜백
  const lastAlarmElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setCurrentPage((prevPage) => {
            const nextPage = prevPage + 1;
            loadMoreAlarms(nextPage);
            return nextPage;
          });
        }
      });

      if (node) {
        observerRef.current.observe(node);
      }
    },
    [hasMore]
  );

  // 알람 리스트 중 특정 알람 삭제
  const handleStatusChange = (alarmId: number) => {
    setAlarmData((prevData) => prevData.filter((item) => item.alarmId !== alarmId));
  };

  return {
    alarmData,
    lastAlarmElementRef,
    handleStatusChange,
    isLoadingPage,
  };
}
