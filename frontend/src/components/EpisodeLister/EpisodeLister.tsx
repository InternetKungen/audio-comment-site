import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./EpisodeLister.scss";
import { useAudioContext } from "../../AudioContext";

interface Episode {
  _id: string;
  title: string;
  episodeNumber: number;
  description: string;
  poster: string;
  audioFile: string;
  dateOfRecording: string;
}

const EpisodeLister: React.FC = () => {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { currentAudioFile, isPlaying, setAudioFile, togglePlayPause } =
    useAudioContext();

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
    <div className="episode-lister">
      <h1>Episodes</h1>
      <ul>
        {episodes.map((episode) => {
          const isCurrentPlaying =
            currentAudioFile === episode.audioFile && isPlaying;

          return (
            <li key={episode._id}>
              <Link to={`/episode/${episode._id}`}>
                <div className="episode-card">
                  <div className="episode-info">
                    <h2 className="episode-title">
                      #{episode.episodeNumber} - {episode.title}
                    </h2>
                    <p className="episode-description">{episode.description}</p>
                    <p className="episode-date">
                      {new Date(episode.dateOfRecording).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="episode-poster">
                    <img
                      src={episode.poster}
                      alt={`${episode.title} Poster`}
                      width="200"
                    />
                  </div>
                  <button
                    type="button"
                    className="play-button"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();

                      if (currentAudioFile === episode.audioFile) {
                        // Om det redan är samma fil, toggla play/pause
                        togglePlayPause();
                      } else {
                        // Om det är en ny fil, sätt filen och starta uppspelningen
                        setAudioFile(episode.audioFile);
                        setTimeout(() => togglePlayPause(), 0); // Säkerställer att togglePlayPause körs efter setAudioFile
                      }
                    }}
                  >
                    {isCurrentPlaying
                      ? String.fromCharCode(10074, 10074)
                      : String.fromCharCode(9654)}
                  </button>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default EpisodeLister;
