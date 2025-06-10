import React, { createContext, useContext, useState, useMemo } from "react";

interface BackgroundContextType {
  backgroundImage: string | null;
  setBackgroundImage: (imageUrl: string) => void;
}

const BackgroundContext = createContext<BackgroundContextType | undefined>(
  undefined
);

export const BackgroundProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);

  const updateBackgroundImage = (imageUrl: string) => {
    setBackgroundImage(imageUrl);
  };

  // Effect to apply background styles
  // useEffect(() => {
  //   if (backgroundImage) {
  //     document.body.style.backgroundImage = `url(${backgroundImage})`;
  //   } else {
  //     document.body.style.backgroundImage = "";
  //   }
  // }, [backgroundImage]);

  const backgroundContextValue = useMemo(
    () => ({
      backgroundImage,
      setBackgroundImage: updateBackgroundImage,
    }),
    [backgroundImage]
  );

  return (
    <BackgroundContext.Provider value={backgroundContextValue}>
      {children}
    </BackgroundContext.Provider>
  );
};

export const useBackgroundContext = () => {
  const context = useContext(BackgroundContext);
  if (!context) {
    throw new Error(
      "useBackgroundContext måste användas inom en BackgroundProvider"
    );
  }
  return context;
};
