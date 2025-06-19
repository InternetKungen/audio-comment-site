import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAudioContext } from "../../../AudioContext";
// import { useBackgroundContext } from "../../../BackgroundContext";
import downloadIcon from "../../../assets/icons/download_35dp_F3C78F_FILL0_wght400_GRAD0_opsz40.png";
import CommentSection from "../../../components/CommentSection/CommentSection";
import Spinner from "../../../components/Spinner/Spinner";
import "./EpisodePage.scss";

interface Episode {
  _id: string;
  title: string;
  episodeNumber: number;
  description: string;
  poster: string;
  length: number;
  characters: string[];
  players: string[];
  gameMaster: string;
  audioFile: string;
  audioUrl: string;
  downloadUrl: string;
  rating: number;
}

const EpisodePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const {
    currentAudioFile,
    isPlaying,
    isLoading,
    setAudioFileAndPlay,
    togglePlayPause,
  } = useAudioContext();
  // const { setBackgroundImage } = useBackgroundContext();

  useEffect(() => {
    const fetchEpisode = async () => {
      try {
        const response = await fetch(`/api/episode/${id}`);
        if (!response.ok) throw new Error("Failed to fetch episode");
        const data = await response.json();
        setEpisode(data);
      } catch (error) {
        console.error("Error fetching episode:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEpisode();
  }, [id]);

  // useEffect(() => {
  //   if (episode) {
  //     setBackgroundImage(episode.poster);
  //   }
  // }, [episode, setBackgroundImage]);

  const downloadEpisode = () => {
    if (!episode || !episode.downloadUrl) return;

    try {
      const filename = `Episode_${
        episode.episodeNumber
      }_${episode.title.replace(/[^a-z0-9]/gi, "_")}.mp3`;

      const url = `${episode.downloadUrl}?name=${encodeURIComponent(filename)}`;

      const link = document.createElement("a");
      link.href = url;
      link.download = filename; // fallback i vissa fall

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading episode:", error);
      alert("Failed to download the episode. Please try again.");
    }
  };

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
  if (!episode) return <p>Episode not found.</p>;

  const isCurrentPlaying = currentAudioFile === episode.audioUrl && isPlaying;
  // Kontrollera om denna specifika fil laddar
  const isCurrentFileLoading =
    isLoading && currentAudioFile === episode.audioUrl;
  return (
    <div className="episode-page">
      <h1 className="episode-title">
        <span>#{episode.episodeNumber} - </span>
        <span>{episode.title}</span>
      </h1>
      <div className="episode-poster">
        <img
          className="episode-poster__image"
          src={episode.poster}
          alt={`${episode.title} Poster`}
          width="300"
        />
      </div>
      <div className="episode-info">
        <p>
          <strong>Length:</strong> {episode.length} minutes
        </p>
        <p>
          <strong>Game Master:</strong> {episode.gameMaster}
        </p>
        <p>
          <strong>Characters:</strong> {episode.characters.join(", ")}
        </p>
        <p>
          <strong>Players:</strong> {episode.players.join(", ")}
        </p>
      </div>
      <div className="episode-description">
        <p>{episode.description}</p>
      </div>
      <div className="episode-audio">
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
        <button
          type="button"
          className="download-button"
          onClick={downloadEpisode}
          title="Download Episode"
        >
          <img src={downloadIcon} alt="Download" className="download-icon" />
        </button>
      </div>
      {/* <p>
        <strong>Rating:</strong> {episode.rating}/5
      </p> */}
      {episode && <CommentSection episodeId={episode._id} />}
    </div>
  );
};

export default EpisodePage;
