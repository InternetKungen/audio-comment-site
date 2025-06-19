import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useMemo,
  useEffect,
  useCallback,
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
  setAudioFileAndPlay: (file: string, episode: Episode) => void; // Ny funktion
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
  const [volume, setVolume] = useState(1);
  const [shouldAutoPlay, setShouldAutoPlay] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(
    null as unknown as HTMLAudioElement
  );

  useEffect(() => {
    if (!audioRef.current) {
      const audio = new Audio();
      audio.preload = "metadata";
      // audio.crossOrigin = "anonymous";
      audioRef.current = audio;
    }
  }, []);

  const { setBackgroundImage } = useBackgroundContext();

  useEffect(() => {
    if (currentEpisode) {
      setBackgroundImage(currentEpisode.poster);
    }
  }, [currentEpisode, setBackgroundImage]);

  // Autoplay när filen är redo
  useEffect(() => {
    const audio = audioRef.current;

    const handleCanPlay = () => {
      setIsLoading(false);
      console.log("Audio can start playing");

      // Om autoplay är aktiverat, starta uppspelning
      if (shouldAutoPlay) {
        console.log("Auto-playing audio...");
        setShouldAutoPlay(false); // Återställ autoplay-flag
        audio
          .play()
          .then(() => {
            console.log("Auto-play successful");
          })
          .catch((error) => {
            console.error("Auto-play failed:", error);
            setIsLoading(false);
            setIsPlaying(false);
          });
      }
    };

    audio.addEventListener("canplay", handleCanPlay);

    return () => {
      audio.removeEventListener("canplay", handleCanPlay);
    };
  }, [shouldAutoPlay]);

  useEffect(() => {
    const audio = audioRef.current;

    const handleLoadStart = () => {
      setIsLoading(true);
      console.log("Loading started");
    };

    const handlePlaying = () => {
      setIsLoading(false);
      setIsPlaying(true);
      console.log("Audio is playing");
    };

    const handlePause = () => {
      setIsPlaying(false);
      console.log("Audio paused");
    };

    const handleWaiting = () => {
      setIsLoading(true);
      console.log("Audio is buffering...");
    };

    const handleCanPlayThrough = () => {
      setIsLoading(false);
      console.log("Audio can play through without interruption");
    };

    const handleError = (e: Event) => {
      setIsLoading(false);
      setIsPlaying(false);
      setShouldAutoPlay(false); // Återställ autoplay vid fel
      console.error("Audio error:", e);
      const audioElement = e.target as HTMLAudioElement;
      if (audioElement.error) {
        console.error("Audio error details:", {
          code: audioElement.error.code,
          message: audioElement.error.message,
        });
      }
    };

    const handleLoadedData = () => {
      console.log("Audio data loaded");
    };

    const handleLoadedMetadata = () => {
      console.log("Audio metadata loaded, duration:", audio.duration);
    };

    // Event listeners
    audio.addEventListener("loadstart", handleLoadStart);
    audio.addEventListener("canplaythrough", handleCanPlayThrough);
    audio.addEventListener("playing", handlePlaying);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("waiting", handleWaiting);
    audio.addEventListener("error", handleError);
    audio.addEventListener("loadeddata", handleLoadedData);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      audio.removeEventListener("loadstart", handleLoadStart);
      audio.removeEventListener("canplaythrough", handleCanPlayThrough);
      audio.removeEventListener("playing", handlePlaying);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("waiting", handleWaiting);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("loadeddata", handleLoadedData);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, []);

  const setAudioFile = useCallback(
    (file: string, episode: Episode) => {
      if (currentAudioFile !== file) {
        const audio = audioRef.current;

        // Pausa nuvarande uppspelning
        audio.pause();

        // Sätt ny källa
        audio.src = file;
        audio.preload = "metadata";
        audio.load();

        // Uppdatera state
        setCurrentAudioFile(file);
        setCurrentEpisode(episode);
        setIsPlaying(false);
        setIsLoading(true);

        console.log("Setting new audio file:", file);
      }
    },
    [currentAudioFile]
  );

  const setAudioFileAndPlay = useCallback(
    (file: string, episode: Episode) => {
      console.log("Setting audio file and preparing to play:", file);

      if (currentAudioFile !== file) {
        // Ny fil - sätt autoplay-flag
        setShouldAutoPlay(true);
        setAudioFile(file, episode);
      } else {
        // Samma fil - bara toggla play/pause
        togglePlayPause();
      }
    },
    [currentAudioFile, setAudioFile]
  );

  const togglePlayPause = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || !currentAudioFile) {
      console.log("No audio file loaded");
      return;
    }

    try {
      if (audio.paused) {
        setIsLoading(true);
        console.log("Attempting to play audio...");

        await audio.play();
        // Playing event kommer att hantera state-uppdateringarna
      } else {
        console.log("Pausing audio...");
        audio.pause();
      }
    } catch (error) {
      console.error("Error during play/pause:", error);
      setIsLoading(false);
      setIsPlaying(false);
    }
  }, [currentAudioFile]);

  const handleVolumeChange = useCallback((volume: number) => {
    setVolume(volume);
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, []);

  const audioContextValue = useMemo(
    () => ({
      currentAudioFile,
      currentEpisode,
      isPlaying,
      isLoading,
      volume,
      audioRef,
      setAudioFile,
      setAudioFileAndPlay, // Lägg till ny funktion
      togglePlayPause,
      setVolume: handleVolumeChange,
    }),
    [
      currentAudioFile,
      currentEpisode,
      isPlaying,
      isLoading,
      volume,
      setAudioFile,
      setAudioFileAndPlay,
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
