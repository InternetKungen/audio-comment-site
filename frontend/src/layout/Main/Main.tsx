import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../../views/pages/Home/Home";
// import Profile from "../../views/auth/Profile/Profile";
// import ProtectedRoute from "../../ProtectedRoute";
import "./Main.scss";
import EpisodeLister from "../../components/EpisodeLister/EpisodeLister";
import EpisodePage from "../../components/EpisodePage/EpisodePage";

const Main: React.FC = () => {
  return (
    <main className="main">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/episodes" element={<EpisodeLister />} />
        <Route path="/episode/:id" element={<EpisodePage />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </main>
  );
};

export default Main;
