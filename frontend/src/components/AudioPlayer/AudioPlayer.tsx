import React, { useRef, useState, useEffect } from "react";
import "./AudioPlayer.scss";

interface AudioPlayerProps {
  audioFile: string | null;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioFile }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1); // Standardvolym (1 = 100%)

  const localStorageKey = `audio-player-${audioFile}`;

  // Återställ senaste tid och volym från localStorage
  useEffect(() => {
    if (audioFile && audioRef.current) {
      const savedTime = parseFloat(
        localStorage.getItem(localStorageKey) || "0"
      );
      if (!isNaN(savedTime) && savedTime > 0) {
        audioRef.current.currentTime = savedTime;
        setCurrentTime(savedTime);
      }

      const savedVolume = parseFloat(
        localStorage.getItem("audio-player-volume") || "1"
      );
      if (!isNaN(savedVolume)) {
        setVolume(savedVolume);
        if (audioRef.current) audioRef.current.volume = savedVolume;
      }

      // Försök att spela upp ljudet automatiskt
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.error("Autoplay failed:", err));
    }
  }, [audioFile]);

  // Uppdatera currentTime och spara i localStorage
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const time = audioRef.current.currentTime;
      setCurrentTime(time);
      localStorage.setItem(localStorageKey, time.toString());
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const newTime = parseFloat(e.target.value);
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
      localStorage.setItem(localStorageKey, newTime.toString());
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    localStorage.setItem("audio-player-volume", newVolume.toString());
  };

  if (!audioFile) {
    return null;
  }

  return (
    <div className="audio-player">
      <audio
        ref={audioRef}
        src={audioFile}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />
      <button onClick={togglePlay} className="play-button">
        {isPlaying
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
