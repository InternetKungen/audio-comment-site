import React, { useEffect, useState } from "react";
import "./Popup.scss";

type PopupProps = {
  title: string;
  info: string;
  onClose: () => void;
  duration?: number; // Tid popupen ska visas i millisekunder
};

const Popup: React.FC<PopupProps> = ({
  title,
  info,
  onClose,
  duration = 3000,
}) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Starta en timer för att trigga fade-out efter `duration` - 500ms (för att visa fade-out-effekten)
    const timer = setTimeout(() => setFadeOut(true), duration - 500);
    // Starta en timer för att stänga popupen efter `duration`
    const closeTimer = setTimeout(() => onClose(), duration);

    // Rensa timers när komponenten unmountas
    return () => {
      clearTimeout(timer);
      clearTimeout(closeTimer);
    };
  }, [duration, onClose]);

  return (
    <div
      className={`popup-overlay ${fadeOut ? "fade-out" : ""}`}
      onClick={onClose}
    >
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <h2>{title}</h2>
        <p>{info}</p>
      </div>
    </div>
  );
};

export default Popup;
