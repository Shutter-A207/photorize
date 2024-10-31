import React from "react";
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

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Loading />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/notifications" element={<Alarm />} />

        <Route path="/album" element={<Album />} />
        <Route path="/album/:id" element={<AlbumDetail />} />
        <Route path="/memory/:id" element={<Memory />} />

        <Route path="/pose" element={<Pose />} />

        <Route path="/spot" element={<Spot />} />
      </Routes>
    </>
  );
}

export default App;
