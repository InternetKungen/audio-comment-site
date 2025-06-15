import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./EpisodeLister.scss";
import { useAudioContext } from "../../AudioContext";
import Spinner from "../Spinner/Spinner";
// import recentIcon from "../../assets/icons/schedule_35dp_F3C78F_FILL0_wght400_GRAD0_opsz40.png";
// import episodeNumberIcon from "../../assets/icons/tag_35dp_F3C78F_FILL0_wght400_GRAD0_opsz40.png";
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

  if (loading)
    return (
      <div className="spinner-container">
        <Spinner size="md" />
      </div>
    );

  return (
    <div className="episode-lister">
      {/* <h1>Episodes</h1> */}
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
          <option value="recent">
            🕔
            {/* <span className="recent-icon">
              <img src={recentIcon} alt="Recent Icon" />
            </span> */}
          </option>
          <option value="episodeAsc">
            #
            {/* <span className="episode-number-icon">
              <img src={episodeNumberIcon} alt="Episode Number Icon" />
            </span> */}
          </option>
        </select>
      </div>
      <ul>
        {sortedEpisodes.map((episode) => {
          const isCurrentPlaying =
            currentAudioFile === episode.audioUrl && isPlaying;

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
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();

                      if (currentAudioFile === episode.audioUrl) {
                        // Om det redan är samma fil, toggla play/pause
                        togglePlayPause();
                      } else {
                        // Om det är en ny fil, sätt filen och starta uppspelningen
                        setAudioFile(episode.audioUrl, {
                          episodeNumber: episode.episodeNumber,
                          title: episode.title,
                          poster: episode.poster,
                        });
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
