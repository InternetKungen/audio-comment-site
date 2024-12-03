import React from "react";
import { useAudioContext } from "../../AudioContext";
import AudioPlayer from "../../components/AudioPlayer/AudioPlayer";
import "./Footer.scss";

const Footer: React.FC = () => {
  const { currentAudioFile } = useAudioContext();

  return (
    <footer className="footer">
      {currentAudioFile && <AudioPlayer audioFile={currentAudioFile} />}
    </footer>
  );
};

export default Footer;
