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
import ProtectedRoute from "./auth/ProtectedRoute";
import RedirectIfAuthenticated from "./auth/RedirectIfAuthenticated";
import Album2 from "./pages/Album/Album2";

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
    <Routes>
      {/* 비로그인 사용자는 접근할 수 없는 보호된 경로 */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/home2"
        element={
          <ProtectedRoute>
            <Home2 />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <Alarm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/album"
        element={
          <ProtectedRoute>
            <Album />
          </ProtectedRoute>
        }
      />
      <Route
        path="/album2"
        element={
          <ProtectedRoute>
            <Album2 />
          </ProtectedRoute>
        }
      />
      <Route
        path="/album/:id"
        element={
          <ProtectedRoute>
            <AlbumDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/album/edit"
        element={
          <ProtectedRoute>
            <AlbumEdit />
          </ProtectedRoute>
        }
      />
      <Route
        path="/memory/:id"
        element={
          <ProtectedRoute>
            <Memory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/modify-memory/:id"
        element={
          <ProtectedRoute>
            <ModifyMemory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/record"
        element={
          <ProtectedRoute>
            <Record />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pose"
        element={
          <ProtectedRoute>
            <Pose />
          </ProtectedRoute>
        }
      />
      <Route
        path="/spot"
        element={
          <ProtectedRoute>
            <Spot />
          </ProtectedRoute>
        }
      />
      <Route
        path="/spot/:id"
        element={
          <ProtectedRoute>
            <SpotDetail />
          </ProtectedRoute>
        }
      />

      {/* 로그인된 사용자가 접근할 수 없는 경로 */}
      <Route
        path="/login"
        element={
          <RedirectIfAuthenticated>
            <Login />
          </RedirectIfAuthenticated>
        }
      />
      <Route
        path="/register"
        element={
          <RedirectIfAuthenticated>
            <Register />
          </RedirectIfAuthenticated>
        }
      />

      {/* 공용 경로 */}
      <Route path="/" element={<Loading />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
