import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Loading from "./pages/Loading";
import Login from "./pages/Login/Login";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Loading />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  );
}

export default App;
