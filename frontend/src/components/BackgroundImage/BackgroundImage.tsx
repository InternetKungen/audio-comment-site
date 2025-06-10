import React, { useEffect, useState } from "react";
import { useBackgroundContext } from "../../BackgroundContext";
import "./BackgroundImage.scss";

const BackgroundImage: React.FC = () => {
  const { backgroundImage } = useBackgroundContext();
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [prevImage, setPrevImage] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (backgroundImage && backgroundImage !== currentImage) {
      setPrevImage(currentImage); // sparar nuvarande som "uttonande"
      setCurrentImage(backgroundImage); // ny bild blir "intonande"
      setIsTransitioning(true);

      const timeout = setTimeout(() => {
        setPrevImage(null); // rensa efter fade
        setIsTransitioning(false);
      }, 600); // matchar CSS-tiden

      return () => clearTimeout(timeout);
    }
  }, [backgroundImage]);

  return (
    <div className="background-wrapper">
      <div className="background-left-edge" />
      <div className="background-right-edge" />
      {prevImage && isTransitioning && (
        <div
          className="background-image fade-out"
          style={{ backgroundImage: `url(${prevImage})` }}
        />
      )}
      {currentImage && (
        <div
          className={`background-image ${isTransitioning ? "fade-in" : ""}`}
          style={{ backgroundImage: `url(${currentImage})` }}
        />
      )}
    </div>
  );
};

export default BackgroundImage;
