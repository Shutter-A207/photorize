import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Loading from "./pages/Loading";
import Alarm from "./pages/Alarm/Alarm";
import Album from "./pages/Album/Album";
import Record from "./pages/Album/Record";
import Pose from "./pages/Pose/Pose";
import Spot from "./pages/Spot/Spot";
import Login from "./pages/Login/Login";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Loading />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/notifications" element={<Alarm />} />
        <Route path="/record" element={<Record />} />
        <Route path="/album" element={<Album />} />
        <Route path="/pose" element={<Pose />} />
        <Route path="/spot" element={<Spot />} />
      </Routes>
    </>
  );
}

export default App;
