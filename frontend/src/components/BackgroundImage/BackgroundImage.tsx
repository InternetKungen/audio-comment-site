import React, { useEffect, useState } from "react";
import { useBackgroundContext } from "../../BackgroundContext";
import "./BackgroundImage.scss";

const BackgroundImage: React.FC = () => {
  const { backgroundImage } = useBackgroundContext();
  const [visibleImage, setVisibleImage] = useState<string | null>(null);

  useEffect(() => {
    if (backgroundImage !== visibleImage) {
      const timeout = setTimeout(() => {
        setVisibleImage(backgroundImage);
      }, 300); // matchar CSS fade-out
      return () => clearTimeout(timeout);
    }
  }, [backgroundImage]);

  return (
    <div className="background-wrapper">
      {visibleImage && (
        <div
          key={visibleImage} // tvingar omrendering för animation
          className="background-fade"
          style={{ backgroundImage: `url(${visibleImage})` }}
        />
      )}
    </div>
  );
};

export default BackgroundImage;
