import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./EpisodeLister.scss";
import { useAudioContext } from "../../AudioContext";
import Spinner from "../Spinner/Spinner";
import sortIcon from "../../assets/icons/sort_35dp_F3C78F_FILL0_wght400_GRAD0_opsz40.png";

interface Episode {
  _id: string;
  title: string;
  episodeNumber: number;
  description: string;
  poster: string;
  audioFile: string;
  audioUrl: string;
  downloadUrl: string;
  dateOfRecording: string;
}

const EpisodeLister: React.FC = () => {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sortOption, setSortOption] = useState<"episodeAsc" | "recent">(
    "episodeAsc"
  );
  const {
    currentAudioFile,
    isPlaying,
    isLoading,
    setAudioFileAndPlay,
    togglePlayPause,
  } = useAudioContext();

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

  const sortEpisodes = (episodeList: Episode[]) => {
    switch (sortOption) {
      case "episodeAsc":
        return [...episodeList].sort(
          (a, b) => a.episodeNumber - b.episodeNumber
        );
      case "recent":
      default:
        return [...episodeList].sort(
          (a, b) =>
            new Date(b.dateOfRecording).getTime() -
            new Date(a.dateOfRecording).getTime()
        );
    }
  };

  const sortedEpisodes = sortEpisodes(episodes);

  const handlePlayButtonClick = (episode: Episode, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    console.log("Play button clicked for episode:", episode.episodeNumber);

    if (currentAudioFile === episode.audioUrl) {
      // Samma fil - bara toggla play/pause
      console.log("Toggling play/pause for current file");
      togglePlayPause();
    } else {
      // Ny fil - sätt fil och spela
      console.log("Setting new file and playing:", episode.audioUrl);
      setAudioFileAndPlay(episode.audioUrl, {
        episodeNumber: episode.episodeNumber,
        title: episode.title,
        poster: episode.poster,
      });
    }
  };

  if (loading)
    return (
      <div className="spinner-container">
        <Spinner size="md" />
      </div>
    );

  return (
    <div className="episode-lister">
      <div className="sorting-controls">
        <label htmlFor="sort-select">
          <img src={sortIcon} alt="Sort Icon" />
        </label>
        <select
          id="sort-select"
          value={sortOption}
          onChange={(e) =>
            setSortOption(e.target.value as "episodeAsc" | "recent")
          }
        >
          <option value="recent">🕔</option>
          <option value="episodeAsc">#</option>
        </select>
      </div>

      <ul>
        {sortedEpisodes.map((episode) => {
          const isCurrentPlaying =
            currentAudioFile === episode.audioUrl && isPlaying;
          const isCurrentFileLoading =
            isLoading && currentAudioFile === episode.audioUrl;

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
                    <img src={episode.poster} alt={`${episode.title} Poster`} />
                  </div>
                  <button
                    type="button"
                    className="play-button"
                    onClick={(event) => handlePlayButtonClick(episode, event)}
                    disabled={isCurrentFileLoading}
                  >
                    {isCurrentFileLoading ? (
                      <Spinner size="sm" />
                    ) : isCurrentPlaying ? (
                      String.fromCharCode(10074, 10074) // Paus-symbol
                    ) : (
                      String.fromCharCode(9654) // Play-symbol
                    )}
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
