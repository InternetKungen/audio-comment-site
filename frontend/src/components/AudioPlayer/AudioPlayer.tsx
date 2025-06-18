import React, { useEffect, useState } from "react";
import { useAudioContext } from "../../AudioContext";
import Spinner from "../Spinner/Spinner";
import "./AudioPlayer.scss";

interface Episode {
  episodeNumber: number;
  title: string;
  poster: string;
}

interface AudioPlayerProps {
  audioUrl: string;
  episode: Episode;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl, episode }) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const {
    currentAudioFile,
    isPlaying,
    isLoading, // Använd loading state
    setAudioFile,
    togglePlayPause,
    setVolume,
    volume,
    audioRef,
  } = useAudioContext();

  const localStorageKey = `audio-${audioUrl}-time`;

  useEffect(() => {
    const savedTime = localStorage.getItem(localStorageKey);
    if (savedTime && audioRef.current) {
      audioRef.current.currentTime = parseFloat(savedTime);
      setCurrentTime(parseFloat(savedTime));
    }
  }, [audioUrl, audioRef]);

  useEffect(() => {
    if (!audioRef.current) return;

    const audio = audioRef.current;

    const updateDuration = () => setDuration(audio.duration);
    const updateTime = () => {
      setCurrentTime(audio.currentTime);
      localStorage.setItem(localStorageKey, audio.currentTime.toString());
    };

    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("timeupdate", updateTime);

    return () => {
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("timeupdate", updateTime);
    };
  }, [audioRef]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const newTime = parseFloat(e.target.value);
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  const handlePlayPause = () => {
    if (currentAudioFile !== audioUrl) {
      setAudioFile(audioUrl, episode);
    }
    togglePlayPause();
  };

  // Kontrollera om denna specifika fil laddar
  const isCurrentFileLoading = isLoading && currentAudioFile === audioUrl;

  return (
    <div className="audio-player">
      <div className="episode-info">
        <h3>{`# ${episode.episodeNumber}: ${episode.title}`}</h3>
      </div>
      <button onClick={handlePlayPause} className="play-button">
        {isCurrentFileLoading ? (
          <Spinner size="sm" />
        ) : isPlaying && currentAudioFile === audioUrl ? (
          String.fromCharCode(10074, 10074)
        ) : (
          String.fromCharCode(9654)
        )}
      </button>
      <input
        title="duration"
        type="range"
        min="0"
        max={duration || 0}
        value={currentTime}
        onChange={handleSeek}
        className="progress-bar"
      />
      <input
        title="volume"
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={handleVolumeChange}
        className="volume-control"
      />
      <span className="time-display">
        {formatTime(currentTime)} / {formatTime(duration)}
      </span>
    </div>
  );
};

const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
};

export default AudioPlayer;
