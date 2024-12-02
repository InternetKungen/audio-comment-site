import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Episode {
  _id: string;
  title: string;
  episodeNumber: number;
  description: string;
  poster: string;
}

const EpisodeLister: React.FC = () => {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        const response = await fetch("/api/episode");
        if (!response.ok) throw new Error("Failed to fetch episodes");
        const data = await response.json();
        setEpisodes(data);
      } catch (error) {
        console.error("Error fetching episodes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEpisodes();
  }, []);

  if (loading) return <p>Loading episodes...</p>;

  return (
    <div>
      <h1>Episodes</h1>
      <ul>
        {episodes.map((episode) => (
          <li key={episode._id}>
            <Link to={`/episode/${episode._id}`}>
              <div>
                <h2>
                  #{episode.episodeNumber} - {episode.title}
                </h2>
                <p>{episode.description}</p>
                <img
                  src={episode.poster}
                  alt={`${episode.title} Poster`}
                  width="200"
                />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EpisodeLister;
