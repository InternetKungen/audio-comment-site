import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAudioContext } from "../../../AudioContext";
// import { useBackgroundContext } from "../../../BackgroundContext";
import downloadIcon from "../../../assets/icons/download_35dp_F3C78F_FILL0_wght400_GRAD0_opsz40.png";
import CommentSection from "../../../components/CommentSection/CommentSection";
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
  const { currentAudioFile, isPlaying, setAudioFile, togglePlayPause } =
    useAudioContext();
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

  const downloadEpisode = async () => {
    if (!episode) return;

    try {
      // Fetch the audio file
      const response = await fetch(episode.downloadUrl);
      const blob = await response.blob();

      // Create a download link
      const downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(blob);

      // Generate a filename with episode number and title
      const filename = `Episode_${
        episode.episodeNumber
      }_${episode.title.replace(/[^a-z0-9]/gi, "_")}.mp3`;
      downloadLink.download = filename;

      // Trigger the download
      document.body.appendChild(downloadLink);
      downloadLink.click();

      // Clean up
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(downloadLink.href);
    } catch (error) {
      console.error("Error downloading episode:", error);
      alert("Failed to download the episode. Please try again.");
    }
  };

  if (loading) return <p>Loading episode...</p>;
  if (!episode) return <p>Episode not found.</p>;

  const isCurrentPlaying = currentAudioFile === episode.audioUrl && isPlaying;

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
          onClick={() => {
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
