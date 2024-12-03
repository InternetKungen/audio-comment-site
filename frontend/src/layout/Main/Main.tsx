import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../../views/pages/Home/Home";
import Profile from "../../views/auth/Profile/Profile";
import ProtectedRoute from "../../ProtectedRoute";
import "./Main.scss";
import EpisodeLister from "../../components/EpisodeLister/EpisodeLister";
import EpisodePage from "../../views/pages/EpisodePage/EpisodePage";
import BackOffice from "../../views/auth/BackOffice/BackOffice";
import AdminProtectedRoute from "../../AdminProtectedRoute";

const Main: React.FC = () => {
  return (
    <main className="main">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/episodes" element={<EpisodeLister />} />
        <Route path="/episode/:id" element={<EpisodePage />} />
        <Route
          path="/profile"
          element={<ProtectedRoute element={<Profile />} />}
        />
        <Route
          path="/back-office"
          element={<AdminProtectedRoute element={<BackOffice />} />}
        />
        <Route path="*" element={<Home />} />
      </Routes>
    </main>
  );
};

export default Main;
