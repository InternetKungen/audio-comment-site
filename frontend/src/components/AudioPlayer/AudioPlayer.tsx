import React, { useEffect, useState, useCallback } from "react";
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
  const [hasRestoredTime, setHasRestoredTime] = useState(false);

  const {
    currentAudioFile,
    isPlaying,
    isLoading,
    setAudioFile,
    togglePlayPause,
    setVolume,
    volume,
    audioRef,
  } = useAudioContext();

  const localStorageKey = `audio-${audioUrl}-time`;

  // Återställ sparad tid endast när en ny fil laddas
  const restoreSavedTime = useCallback(() => {
    if (hasRestoredTime || currentAudioFile !== audioUrl) return;

    const savedTime = localStorage.getItem(localStorageKey);
    if (savedTime && audioRef.current && audioRef.current.duration > 0) {
      const time = parseFloat(savedTime);
      // Validera att tiden är rimlig
      if (time >= 0 && time < audioRef.current.duration) {
        console.log("Restoring saved time:", time);
        audioRef.current.currentTime = time;
        setCurrentTime(time);
        setHasRestoredTime(true);
      }
    }
  }, [audioUrl, currentAudioFile, hasRestoredTime, localStorageKey, audioRef]);

  // Återställ hasRestoredTime när ny fil väljs
  useEffect(() => {
    if (currentAudioFile !== audioUrl) {
      setHasRestoredTime(false);
    }
  }, [audioUrl, currentAudioFile]);

  useEffect(() => {
    if (!audioRef.current) return;

    const audio = audioRef.current;

    const updateDuration = () => {
      setDuration(audio.duration);
      console.log("Duration updated:", audio.duration);
      // Försök återställa sparad tid när metadata är laddad
      restoreSavedTime();
    };

    const updateTime = () => {
      const newTime = audio.currentTime;
      setCurrentTime(newTime);

      // Spara tid endast om det är den aktiva filen och tiden är giltig
      if (currentAudioFile === audioUrl && newTime > 0) {
        localStorage.setItem(localStorageKey, newTime.toString());
      }
    };

    const handleCanPlay = () => {
      // Försök återställa sparad tid när filen kan spelas
      restoreSavedTime();
    };

    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("canplay", handleCanPlay);

    return () => {
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("canplay", handleCanPlay);
    };
  }, [audioRef, currentAudioFile, audioUrl, localStorageKey, restoreSavedTime]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const newTime = parseFloat(e.target.value);
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);

      // Uppdatera localStorage direkt vid seeking
      if (currentAudioFile === audioUrl) {
        localStorage.setItem(localStorageKey, newTime.toString());
      }
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  const handlePlayPause = () => {
    // Sätt ny fil först om det behövs
    if (currentAudioFile !== audioUrl) {
      console.log("Setting new audio file before playing");
      setAudioFile(audioUrl, episode);
    }

    // Sedan toggle play/pause
    togglePlayPause();
  };

  // Kontrollera om denna specifika fil laddar
  const isCurrentFileLoading = isLoading && currentAudioFile === audioUrl;
  const isCurrentlyPlaying = isPlaying && currentAudioFile === audioUrl;

  return (
    <div className="audio-player">
      <div className="episode-info">
        <h3>{`# ${episode.episodeNumber}: ${episode.title}`}</h3>
      </div>

      <button
        onClick={handlePlayPause}
        className="play-button"
        disabled={isCurrentFileLoading}
      >
        {isCurrentFileLoading ? (
          <Spinner size="sm" />
        ) : isCurrentlyPlaying ? (
          String.fromCharCode(10074, 10074) // Paus-symbol
        ) : (
          String.fromCharCode(9654) // Play-symbol
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
        disabled={!duration}
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
  if (!time || !isFinite(time)) return "0:00";

  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
};

export default AudioPlayer;
