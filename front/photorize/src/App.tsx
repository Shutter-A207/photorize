import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Loading from "./pages/Loading";
import Alarm from "./pages/Alarm/Alarm";
<<<<<<< HEAD
import Album from "./pages/Album/Album";
import Record from "./pages/Album/Record";
import Pose from "./pages/Pose/Pose";
import Spot from "./pages/Spot/Spot";
=======
import Header from "./components/Common/Header";
>>>>>>> 1c88519 (Feat: 헤더 네비게이션 구현)

function App() {
  return (
    <>
<<<<<<< HEAD
      <Routes>
        <Route path="/" element={<Loading />} />
        <Route path="/home" element={<Home />} />
        <Route path="/notifications" element={<Alarm />} />
        <Route path="/record" element={<Record />} />
        <Route path="/album" element={<Album />} />
        <Route path="/pose" element={<Pose />} />
        <Route path="/spot" element={<Spot />} />
=======
      <Header title="앨범" />
      <Routes>
        <Route path="/" element={<Loading />} />
        <Route path="/home" element={<Home />} />
        <Route path="/notification" element={<Alarm />} />
>>>>>>> 1c88519 (Feat: 헤더 네비게이션 구현)
      </Routes>
    </>
  );
}

export default App;
