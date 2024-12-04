import React from "react";
import { useAudioContext } from "../../AudioContext";
import AudioPlayer from "../../components/AudioPlayer/AudioPlayer";
import "./Footer.scss";

const Footer: React.FC = () => {
  const { currentAudioFile, currentEpisode } = useAudioContext();

  return (
    <footer className="footer">
      {currentAudioFile && currentEpisode && (
        <AudioPlayer audioFile={currentAudioFile} episode={currentEpisode} />
      )}
    </footer>
  );
};

export default Footer;
