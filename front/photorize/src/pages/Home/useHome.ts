import { useState, useEffect, useRef, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { getUserInfo, deleteFcmToken } from "../../api/UserAPI";
import { fetchMainPageMemories } from "../../api/MemoryAPI";
import { useLoading } from "../../components/Common/Loader/LoadingContext";
import { useNavigate } from "react-router-dom";

export interface Memory {
  memoryId: number;
  url: string;
  date: string;
  albumId: number;
  albumName: string;
}

export interface UserProfile {
  nickname: string;
  img: string;
}

export function useHome() {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const { setIsLoading } = useLoading();

  // 데이터 패치
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const userData = await getUserInfo();
        localStorage.setItem("nickname", userData.nickname);
        localStorage.setItem("img", userData.img);
        setUserProfile(userData);

        const memoryData = await fetchMainPageMemories();
        setMemories(memoryData.data);
      } catch (error) {
        console.error("데이터 로드 중 오류 발생:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [setIsLoading]);

  // 캐러셀 제어 함수
  const handlePrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  );
  const handleNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  );

  // 메뉴 토글 함수
  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  // 로그아웃
  const handleLogout = async () => {
    try {
      await deleteFcmToken();
      localStorage.removeItem("photorize-token");
      navigate("/login");
    } catch (error) {
      console.error("로그아웃 중 오류 발생:", error);
    }
  };

  // 메뉴 바깥 클릭 핸들러
  const handleClickOutside = (e: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return {
    userProfile,
    setUserProfile,
    memories,
    emblaRef,
    handlePrev,
    handleNext,
    menuOpen,
    toggleMenu,
    menuRef,
    handleLogout,
  };
}