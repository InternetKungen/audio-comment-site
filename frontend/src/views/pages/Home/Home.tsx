import React from "react";
import "./Home.scss";
import EpisodeLister from "../../../components/EpisodeLister/EpisodeLister";

const Home: React.FC = () => {
  return (
    <div className="home">
      <EpisodeLister />
    </div>
  );
};

export default Home;
