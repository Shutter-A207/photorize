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
  const [showMarkers, setShowMarkers] = useState(true);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [spots, setSpots] = useState([]);
  const [markers, setMarkers] = useState<any[]>([]);
  const [userMarker, setUserMarker] = useState<any>(null); // 사용자 위치 마커 상태

  useEffect(() => {
    const script = document.createElement("script");
    const apiKey = import.meta.env.VITE_KAKAO_API_KEY;
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        const container = document.getElementById("map");

        // 마지막으로 저장된 위치 정보 가져오기
        const lastCenter = sessionStorage.getItem("lastCenter");
        const lastLevel = sessionStorage.getItem("lastLevel");

        const options = {
          center: lastCenter
            ? new window.kakao.maps.LatLng(
                JSON.parse(lastCenter).lat,
                JSON.parse(lastCenter).lng
              )
            : new window.kakao.maps.LatLng(37.5665, 126.978), // 기본 위치
          level: lastLevel ? parseInt(lastLevel, 10) : 3,
        };

        const map = new window.kakao.maps.Map(container, options);

        // 대한민국 영역으로 제한하기
        const southWest = new window.kakao.maps.LatLng(33.0, 124.5);
        const northEast = new window.kakao.maps.LatLng(40, 131.0);
        const bounds = new window.kakao.maps.LatLngBounds(southWest, northEast);
        map.setMaxLevel(13);

        const defaultCenter = new window.kakao.maps.LatLng(37.5665, 126.978);
        // 지도 이동 제한 설정
        const limitDrag = () => {
          const currentBounds = map.getBounds();
          const currentCenter = map.getCenter();

          if (!bounds.contain(currentCenter)) {
            map.setCenter(defaultCenter);
            showToast("이동 가능한 범위를 벗어났습니다.", "warning");
          }
        };

        // 드래그 이벤트에 제한 기능 추가
        window.kakao.maps.event.addListener(map, "dragend", limitDrag);

        // 줌 변경 이벤트에도 제한 기능 추가
        window.kakao.maps.event.addListener(map, "zoom_changed", limitDrag);

        setMapInstance(map);

        if (!lastCenter && navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            const userLocation = new window.kakao.maps.LatLng(
              latitude,
              longitude
            );

            // 사용자 위치가 제한 범위 내에 있는지 확인
            if (bounds.contain(userLocation)) {
              map.setCenter(userLocation);
              addUserMarker(userLocation, map);
            } else {
              showToast("현재 위치가 서비스 지역을 벗어났습니다.", "warning");
            }
          });
        }

        if (!lastCenter && navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            const userLocation = new window.kakao.maps.LatLng(
              latitude,
              longitude
            );
            map.setCenter(userLocation);
            addUserMarker(userLocation, map); // 사용자 위치에 마커 추가
          });
        }

        // 지도 이동, 확대 변경 시 마지막 위치 저장
        window.kakao.maps.event.addListener(map, "center_changed", () => {
          const center = map.getCenter();
          sessionStorage.setItem(
            "lastCenter",
            JSON.stringify({ lat: center.getLat(), lng: center.getLng() })
          );
        });
        window.kakao.maps.event.addListener(map, "zoom_changed", () => {
          sessionStorage.setItem("lastLevel", map.getLevel().toString());
        });

        window.kakao.maps.event.addListener(map, "dragend", () => {
          setShowSearchButton(true);
        });

        window.kakao.maps.event.addListener(map, "zoom_changed", () => {
          const currentLevel = map.getLevel();
          setShowMarkers(currentLevel <= 5);
          if (currentLevel > 5) {
            showToast("지도를 확대해야 검색할 수 있어요!", "warning");
          }
        });

        // 현재 사용자 위치로 마커 설정 (초기 1회만)
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            const userLocation = new window.kakao.maps.LatLng(
              latitude,
              longitude
            );
            addUserMarker(userLocation, map);
            searchSpotsWithinBounds(map);
          });
        } else {
          searchSpotsWithinBounds(map); // 지도 초기 로드 시 스팟 검색
        }
      });
    };

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [navigate]);

  // 사용자 위치 마커 추가 함수
  const addUserMarker = (position, map) => {
    if (userMarker) {
      userMarker.setMap(null);
    }

    const imageSrc = "/assets/usermarkerIcon.png";
    const imageSize = new window.kakao.maps.Size(16, 16);
    const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize);

    const marker = new window.kakao.maps.Marker({
      position,
      image: markerImage,
    });
    marker.setMap(map);
    setUserMarker(marker);
  };

  // 마커 초기화 함수
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
    if (userMarker) {
      userMarker.setMap(mapInstance);
    }
  };

  // 지도 경계 내 스팟 검색
  const searchSpotsWithinBounds = async (map) => {
    clearMarkers();
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

    if (spotsData.length === 0) {
      showToast(
        "주변에 매장이 없어요! \n지도를 움직여 검색해보세요.",
        "warning"
      );
    }

    setSpots(spotsData);
    setShowSearchButton(false);

    const newMarkers = spotsData.map((spot) => {
      const markerPosition = new window.kakao.maps.LatLng(
        spot.latitude,
        spot.longitude
      );

      const imageSrc =
        spot.memoryCount > 0
          ? "/assets/markerIcon2.png"
          : "/assets/markerIcon5.png";
      const imageSize = new window.kakao.maps.Size(36, 46);
      const markerImage = new window.kakao.maps.MarkerImage(
        imageSrc,
        imageSize
      );

      const marker = new window.kakao.maps.Marker({
        position: markerPosition,
        image: markerImage,
      });
      marker.setMap(showMarkers ? map : null);

      if (spot.memoryCount > 0) {
        window.kakao.maps.event.addListener(marker, "click", () => {
          navigate(`/spot/${spot.spotId}`);
        });
      }

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
      customOverlay.setMap(showMarkers ? map : null);

      return { marker, overlay: customOverlay };
    });

    setMarkers(newMarkers);
  };

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

      {showSearchButton && showMarkers && (
        <div
          onClick={() => searchSpotsWithinBounds(mapInstance)}
          className="fixed top-16 left-1/2 transform -translate-x-1/2 w-44 h-10 bg-white rounded-full flex items-center justify-center shadow-md cursor-pointer z-50"
        >
          <img
            src="/assets/resetIcon.png"
            alt="이 지역 재검색"
            className="w-5 h-5 mr-2"
          />
          <p className="text-[#FF93A5] font-semibold">현 위치에서 재검색</p>
        </div>
      )}
    </div>
  );
};

export default KakaoMap;
