import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

declare global {
  interface Window {
    kakao: any;
  }
}

const KakaoMap = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const script = document.createElement("script");
    const apiKey = import.meta.env.VITE_KAKAO_API_KEY;
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              const container = document.getElementById("map");
              const options = {
                center: new window.kakao.maps.LatLng(latitude, longitude),
                level: 3,
              };
              const map = new window.kakao.maps.Map(container, options);

              // 마커 데이터
              const markers = [
                {
                  id: 1,
                  latitude: 37.502994078193844,
                  longitude: 127.02620391135663,
                  memoryCount: 5,
                  placeName: "인생네컷 강남역 1호점",
                },
              ];

              markers.forEach((markerData) => {
                const markerPosition = new window.kakao.maps.LatLng(
                  markerData.latitude,
                  markerData.longitude
                );

                // 마커 이미지 설정
                const imageSrc = "/assets/markerIcon2.png";
                const imageSize = new window.kakao.maps.Size(36, 46);
                const markerImage = new window.kakao.maps.MarkerImage(
                  imageSrc,
                  imageSize
                );

                // 마커 생성
                const marker = new window.kakao.maps.Marker({
                  position: markerPosition,
                  image: markerImage,
                });
                marker.setMap(map);

                // 마커 클릭 시 navigate 호출
                window.kakao.maps.event.addListener(marker, "click", () => {
                  navigate(`/spot/${markerData.id}`);
                });

                // 마커 위에 텍스트 표시
                const content = `
                  <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
                    <div style="position: absolute; top: -70px; font-size: 12px; padding: 2px; background-color: white; border-radius: 4px; border: 1px solid #ddd; margin-bottom: 5px;">
                      ${markerData.placeName}
                    </div>
                    <div style="position: relative;">
                      <div style="position: absolute; top: -37px; left: 50%; transform: translateX(-50%); color: black; font-size: 14px; font-weight: bold;">
                        ${markerData.memoryCount}
                      </div>
                    </div>
                  </div>
                `;

                // 커스텀 오버레이 생성
                const customOverlay = new window.kakao.maps.CustomOverlay({
                  position: markerPosition,
                  content: content,
                  yAnchor: 1,
                });
                customOverlay.setMap(map); // 지도에 추가
              });
            },
            (error) => {
              console.error("Error getting location:", error);
              const container = document.getElementById("map");
              const options = {
                center: new window.kakao.maps.LatLng(37.5665, 126.978),
                level: 3,
              };
              new window.kakao.maps.Map(container, options);
            }
          );
        } else {
          console.error("Geolocation is not supported by this browser.");
        }
      });
    };

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [navigate]);

  return (
    <div
      id="map"
      style={{
        width: "100%",
        height: "100vh",
      }}
    ></div>
  );
};

export default KakaoMap;
