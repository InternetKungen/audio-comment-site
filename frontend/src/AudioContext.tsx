import React, { createContext, useContext, useState, useRef } from "react";

interface AudioContextType {
  currentAudioFile: string | null;
  isPlaying: boolean;
  volume: number;
  audioRef: React.MutableRefObject<HTMLAudioElement>;

  setAudioFile: (file: string) => void;
  togglePlayPause: () => void;
  setVolume: (volume: number) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentAudioFile, setCurrentAudioFile] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1); // Standardvolym 100%
  const audioRef = useRef<HTMLAudioElement>(new Audio());

  const setAudioFile = (file: string) => {
    if (currentAudioFile !== file) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = file;
        audioRef.current.load(); // Försäkra att ljudet laddas innan uppspelning
        audioRef.current.currentTime = 0; // Återställ tid
      }
      setCurrentAudioFile(file);
      setIsPlaying(false);
    }
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.error("Kunde inte spela upp ljudfilen:", err));
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleVolumeChange = (volume: number) => {
    setVolume(volume);
    if (audioRef.current) audioRef.current.volume = volume;
  };

  return (
    <AudioContext.Provider
      value={{
        currentAudioFile,
        isPlaying,
        volume,
        audioRef,
        setAudioFile,
        togglePlayPause,
        setVolume: handleVolumeChange,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudioContext = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudioContext måste användas inom en AudioProvider");
  }
  return context;
};
