import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchSpotsWithinBoundary } from "../api/SpotAPI";
import { useToast } from "./Common/ToastProvider";

declare global {
  interface Window {
    kakao: any;
  }
}

const KakaoMap = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [showSearchButton, setShowSearchButton] = useState(false);
  const [showMarkers, setShowMarkers] = useState(true); // 마커 표시 여부
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [spots, setSpots] = useState([]);
  const [markers, setMarkers] = useState<any[]>([]); // 마커와 오버레이 상태 저장

  useEffect(() => {
    const script = document.createElement("script");
    const apiKey = import.meta.env.VITE_KAKAO_API_KEY;
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        const container = document.getElementById("map");
        const options = {
          center: new window.kakao.maps.LatLng(37.5665, 126.978),
          level: 3,
        };
        const map = new window.kakao.maps.Map(container, options);
        setMapInstance(map);

        window.kakao.maps.event.addListener(map, "dragend", () => {
          setShowSearchButton(true);
        });

        window.kakao.maps.event.addListener(map, "zoom_changed", () => {
          const currentLevel = map.getLevel();
          if (currentLevel > 5) {
            setShowMarkers(false); // 지도 레벨이 6 이상일 때 마커 숨기기
            showToast("지도를 확대해야 검색할 수 있어요!", "warning");
          } else {
            setShowMarkers(true); // 지도 레벨이 5 이하일 때 마커 표시
          }
        });

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            map.setCenter(new window.kakao.maps.LatLng(latitude, longitude));
            searchSpotsWithinBounds(map); // 현재 위치에서 초기 스팟 검색
          });
        }
      });
    };

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [navigate]);

  // 마커 및 오버레이 초기화 함수
  const clearMarkers = () => {
    markers.forEach(({ marker, overlay }) => {
      marker.setMap(null);
      overlay.setMap(null);
    });
    setMarkers([]);
  };

  // 마커 표시/숨김 함수
  const toggleMarkers = (show) => {
    markers.forEach(({ marker, overlay }) => {
      marker.setMap(show ? mapInstance : null);
      overlay.setMap(show ? mapInstance : null);
    });
  };

  // 버튼 클릭 시 현재 지도 경계 내 스팟 검색
  const searchSpotsWithinBounds = async (map) => {
    clearMarkers(); // 기존 마커 및 오버레이 삭제
    const bounds = map.getBounds();
    const topLeftLat = bounds.getNorthEast().getLat();
    const topLeftLng = bounds.getSouthWest().getLng();
    const botRightLat = bounds.getSouthWest().getLat();
    const botRightLng = bounds.getNorthEast().getLng();

    const response = await fetchSpotsWithinBoundary(
      topLeftLat,
      topLeftLng,
      botRightLat,
      botRightLng
    );
    const spotsData = response.data;

    setSpots(spotsData);
    setShowSearchButton(false);

    const newMarkers = spotsData.map((spot) => {
      const markerPosition = new window.kakao.maps.LatLng(
        spot.latitude,
        spot.longitude
      );

      const imageSrc = "/assets/markerIcon2.png";
      const imageSize = new window.kakao.maps.Size(36, 46);
      const markerImage = new window.kakao.maps.MarkerImage(
        imageSrc,
        imageSize
      );

      const marker = new window.kakao.maps.Marker({
        position: markerPosition,
        image: markerImage,
      });
      marker.setMap(showMarkers ? map : null); // showMarkers에 따라 표시

      window.kakao.maps.event.addListener(marker, "click", () => {
        navigate(`/spot/${spot.spotId}`);
      });

      const memoryCountText =
        spot.memoryCount > 0 ? ` (${spot.memoryCount})` : "";

      const content = `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
          <div style="position: absolute; top: -70px; font-size: 12px; padding: 2px; background-color: white; border-radius: 4px; border: 1px solid #ddd; margin-bottom: 5px;">
            ${spot.spotName}${memoryCountText}
          </div>
        </div>
      `;

      const customOverlay = new window.kakao.maps.CustomOverlay({
        position: markerPosition,
        content: content,
        yAnchor: 1,
      });
      customOverlay.setMap(showMarkers ? map : null); // showMarkers에 따라 표시

      return { marker, overlay: customOverlay };
    });

    setMarkers(newMarkers);
  };

  // showMarkers 변경 시 마커 표시/숨김 업데이트
  useEffect(() => {
    if (mapInstance) {
      toggleMarkers(showMarkers);
    }
  }, [showMarkers, mapInstance]);

  return (
    <div style={{ position: "relative" }}>
      <div
        id="map"
        style={{
          width: "100%",
          height: "100vh",
        }}
      ></div>

      {/* 이 지역 재검색 버튼 */}
      {showSearchButton && showMarkers && (
        <div
          onClick={() => searchSpotsWithinBounds(mapInstance)}
          className="fixed bottom-20 right-5 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md cursor-pointer z-50"
        >
          <img
            src="/assets/resetIcon.png"
            alt="이 지역 재검색"
            className="w-6 h-6"
          />
        </div>
      )}
    </div>
  );
};

export default KakaoMap;
