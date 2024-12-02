import React from "react";
import "./Spinner.scss";

type SpinnerProps = {
  size?: "sm" | "md" | "lg";
};

const Spinner: React.FC<SpinnerProps> = ({ size = "md" }) => {
  const spinnerSizeClass = `spinner spinner-${size}`;
  return <div className={spinnerSizeClass}></div>;
};

export default Spinner;
