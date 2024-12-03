import React, { createContext, useContext, useState } from "react";

interface AudioContextProps {
  audioFile: string | null;
  setAudioFile: (file: string | null) => void;
}

const AudioContext = createContext<AudioContextProps | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [audioFile, setAudioFile] = useState<string | null>(null);

  return (
    <AudioContext.Provider value={{ audioFile, setAudioFile }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudioContext = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudioContext must be used within an AudioProvider");
  }
  return context;
};
