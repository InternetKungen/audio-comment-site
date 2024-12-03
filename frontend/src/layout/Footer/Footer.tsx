import React from "react";
import { useAudioContext } from "../../AudioContext";
import AudioPlayer from "../../components/AudioPlayer/AudioPlayer";
import "./Footer.scss";

const Footer: React.FC = () => {
  const { audioFile } = useAudioContext();

  return (
    <footer className="footer">
      <AudioPlayer audioFile={audioFile} />
    </footer>
  );
};

export default Footer;
