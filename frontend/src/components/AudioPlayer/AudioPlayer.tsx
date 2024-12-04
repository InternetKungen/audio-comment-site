import React, { useEffect, useState } from "react";
import { useAudioContext } from "../../AudioContext";
import "./AudioPlayer.scss";

interface Episode {
  episodeNumber: number;
  title: string;
}

interface AudioPlayerProps {
  audioFile: string;
  episode: Episode;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioFile, episode }) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const {
    currentAudioFile,
    isPlaying,
    setAudioFile,
    togglePlayPause,
    setVolume,
    volume,
    audioRef,
  } = useAudioContext();

  const localStorageKey = `audio-${audioFile}-time`;

  useEffect(() => {
    const savedTime = localStorage.getItem(localStorageKey);
    if (savedTime && audioRef.current) {
      audioRef.current.currentTime = parseFloat(savedTime);
      setCurrentTime(parseFloat(savedTime));
    }
  }, [audioFile, audioRef]);

  useEffect(() => {
    if (!audioRef.current) return;

    const audio = audioRef.current;

    // Uppdatera duration när metadata laddas
    const updateDuration = () => setDuration(audio.duration);

    // Uppdatera currentTime när ljudet spelar
    const updateTime = () => {
      setCurrentTime(audio.currentTime);
      // Spara aktuell tid i localStorage
      localStorage.setItem(localStorageKey, audio.currentTime.toString());
    };

    // Lägg till event listeners
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("timeupdate", updateTime);

    // Rensa event listeners vid avmontering
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
    if (currentAudioFile !== audioFile) {
      setAudioFile(audioFile, episode);
    }
    togglePlayPause();
  };

  return (
    <div className="audio-player">
      <div className="episode-info">
        <h3>{`# ${episode.episodeNumber}: ${episode.title}`}</h3>
      </div>
      <button onClick={handlePlayPause} className="play-button">
        {isPlaying && currentAudioFile === audioFile
          ? String.fromCharCode(10074, 10074)
          : String.fromCharCode(9654)}
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
