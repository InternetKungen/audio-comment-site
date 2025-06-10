import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useMemo,
  useEffect,
} from "react";
import { useBackgroundContext } from "./BackgroundContext";

interface Episode {
  episodeNumber: number;
  title: string;
  poster: string;
}

interface AudioContextType {
  currentAudioFile: string | null;
  currentEpisode: Episode | null;
  isPlaying: boolean;
  volume: number;
  audioRef: React.MutableRefObject<HTMLAudioElement>;

  setAudioFile: (file: string, episode: Episode) => void;
  togglePlayPause: () => void;
  setVolume: (volume: number) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentAudioFile, setCurrentAudioFile] = useState<string | null>(null);
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1); // Standardvolym 100%
  const audioRef = useRef<HTMLAudioElement>(new Audio());
  const { setBackgroundImage } = useBackgroundContext();

  useEffect(() => {
    if (currentEpisode) {
      setBackgroundImage(currentEpisode.poster);
    }
  }, [currentEpisode, setBackgroundImage]);
  const setAudioFile = (file: string, episode: Episode) => {
    if (currentAudioFile !== file) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = file;
        audioRef.current.load(); // Försäkra att ljudet laddas innan uppspelning
        audioRef.current.currentTime = 0; // Återställ tid
      }
      setCurrentAudioFile(file);
      setCurrentEpisode(episode);
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

  const audioContextValue = useMemo(
    () => ({
      currentAudioFile,
      currentEpisode,
      isPlaying,
      volume,
      audioRef,
      setAudioFile,
      togglePlayPause,
      setVolume: handleVolumeChange,
    }),
    [
      currentAudioFile,
      currentEpisode,
      isPlaying,
      volume,
      audioRef,
      setAudioFile,
      togglePlayPause,
      handleVolumeChange,
    ]
  );

  return (
    <AudioContext.Provider value={audioContextValue}>
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
