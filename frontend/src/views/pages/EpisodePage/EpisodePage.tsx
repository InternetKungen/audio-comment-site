import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAudioContext } from "../../../AudioContext";
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
  rating: number;
}

const EpisodePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { currentAudioFile, isPlaying, setAudioFile, togglePlayPause } =
    useAudioContext();

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

  if (loading) return <p>Loading episode...</p>;
  if (!episode) return <p>Episode not found.</p>;

  const isCurrentPlaying = currentAudioFile === episode.audioFile && isPlaying;

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
        <p>{episode.description}</p>
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
      <div className="episode-audio">
        <button
          type="button"
          className="play-button"
          onClick={() =>
            currentAudioFile === episode.audioFile
              ? togglePlayPause()
              : setAudioFile(episode.audioFile)
          }
        >
          {isCurrentPlaying ? "⏸" : "▶"}
        </button>
      </div>
      {/* <p>
        <strong>Rating:</strong> {episode.rating}/5
      </p> */}
    </div>
  );
};

export default EpisodePage;
