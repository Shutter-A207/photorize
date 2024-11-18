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
import { requestFcmToken } from "./firebaseConfig";
import { useToast } from "./components/Common/ToastProvider";

function App() {
  const { showToast } = useToast();

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then((registration) => {
          console.log(
            "Service Worker registered with scope:",
            registration.scope
          );
          requestFcmToken();
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    }

    // 메시지 수신 시 알림 표시
    onMessageListener((payload) => {
      showToast(
        `${payload.notification?.title || "알림"} 알림함에서 확인해보세요.`,
        "info" // 토스트 유형 설정 (info, success, warning, error)
      );
    });
  }, [showToast]);

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
