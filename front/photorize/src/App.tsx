import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Loading from "./pages/Loading";
import Alarm from "./pages/Alarm/Alarm";
import Album from "./pages/Album/Album";
import Pose from "./pages/Pose/Pose";
import Spot from "./pages/Spot/Spot";
import Login from "./pages/Login/Login";
import AlbumDetail from "./pages/Album/AlbumDetail";
import Register from "./pages/Register/Register";
import Memory from "./pages/Album/Memory";
import Record from "./pages/Album/Record";
import SpotDetail from "./pages/Spot/SpotDetail";
import AlbumEdit from "./pages/Album/AlbumEdit";
import Home2 from "./pages/Home2";
import ModifyMemory from "./pages/Album/ModifyMemory";
import { onMessageListener } from "./firebaseConfig";
import NotFound from "./pages/NotFound";

function App() {
  useEffect(() => {
    // 메시지 수신 시 알림 표시
    onMessageListener((payload) => {
      console.log("포그라운드 메시지 수신 성공:", payload);
      alert(
        `알림 제목: ${payload.notification?.title}, 메시지: ${payload.notification?.body}`
      );
    });
  }, []);
  return (
    <>
      <Routes>
        <Route path="/" element={<Loading />} />
        <Route path="/home" element={<Home />} />
        <Route path="/home2" element={<Home2 />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/notifications" element={<Alarm />} />

        <Route path="/album" element={<Album />} />
        <Route path="/album/:id" element={<AlbumDetail />} />
        <Route path="/album/edit" element={<AlbumEdit />} />
        <Route path="/memory/:id" element={<Memory />} />
        <Route path="/modify-memory/:id" element={<ModifyMemory />} />
        <Route path="/record" element={<Record />} />

        <Route path="/pose" element={<Pose />} />

        <Route path="/spot" element={<Spot />} />
        <Route path="/spot/:id" element={<SpotDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
