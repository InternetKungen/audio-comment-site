import React from "react";
import { useParams } from "react-router-dom";
import EpisodePage from "../../../components/EpisodePage/EpisodePage";
import "./Episode.scss";

const Episode: React.FC = () => {
  const { episodeId } = useParams<{ episodeId: string }>();

  if (!episodeId) {
    return <p>Error: No episode ID provided.</p>;
  }

  return (
    <div className="episode">
      <EpisodePage episodeId={episodeId} />
    </div>
  );
};

export default Episode;
