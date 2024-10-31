import React, { useEffect } from "react";

declare global {
  interface Window {
    kakao: any;
  }
}

const KakaoMap = () => {
  useEffect(() => {
    const script = document.createElement("script");
    const apiKey = import.meta.env.VITE_KAKAO_API_KEY;
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        // 사용자의 현재 위치 가져오기
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

              // 인생네컷 강남역 1호점 마커 추가
              const markerPosition = new window.kakao.maps.LatLng(
                37.502994078193844,
                127.02620391135663
              );
              const marker = new window.kakao.maps.Marker({
                position: markerPosition,
              });
              marker.setMap(map);
            },
            (error) => {
              console.error("Error getting location:", error);
              // 위치 정보 실패 시 기본 좌표 설정 (서울)
              const container = document.getElementById("map");
              const options = {
                center: new window.kakao.maps.LatLng(37.5665, 126.978),
                level: 3,
              };
              const map = new window.kakao.maps.Map(container, options);

              // 인생네컷 강남역 1호점 마커 추가
              const markerPosition = new window.kakao.maps.LatLng(
                37.502994078193844,
                127.02620391135663
              );
              const marker = new window.kakao.maps.Marker({
                position: markerPosition,
              });
              marker.setMap(map);
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
  }, []);

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
