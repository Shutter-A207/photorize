import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Loading from "./pages/Loading";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Loading />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  );
}

export default App;
