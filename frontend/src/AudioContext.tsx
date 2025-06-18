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
  isLoading: boolean;
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
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolume] = useState(1); // Standardvolym 100%
  const audioRef = useRef<HTMLAudioElement>(new Audio());
  const { setBackgroundImage } = useBackgroundContext();

  useEffect(() => {
    if (currentEpisode) {
      setBackgroundImage(currentEpisode.poster);
    }
  }, [currentEpisode, setBackgroundImage]);

  useEffect(() => {
    const audio = audioRef.current;
    // Event listeners för att hantera loading states
    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handlePlaying = () => {
      setIsLoading(false);
      setIsPlaying(true);
    };
    const handlePause = () => setIsPlaying(false);
    const handleError = () => {
      setIsLoading(false);
      console.error("Fel vid uppspelning av ljudfil");
    };

    audio.addEventListener("loadstart", handleLoadStart);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("playing", handlePlaying);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("loadstart", handleLoadStart);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("playing", handlePlaying);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("error", handleError);
    };
  }, []);

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
      setIsLoading(true);
    }
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      setIsLoading(true);
      audioRef.current
        .play()
        .then(() => {
          // Playing event kommer att hantera setIsPlaying(true) och setIsLoading(false)
        })
        .catch((err) => console.error("Kunde inte spela upp ljudfilen:", err));
      setIsLoading(false);
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
      isLoading,
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
      isLoading, // Lägg till i dependencies
      volume,
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
