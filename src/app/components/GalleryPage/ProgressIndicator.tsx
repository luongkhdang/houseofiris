import React from "react";

type ProgressIndicatorProps = {
  total: number;
  currentIndex: number;
  onChange: (index: number) => void; // Callback to update currentIndex
};

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  total,
  currentIndex,
  onChange,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newIndex = parseInt(event.target.value, 10);
    onChange(newIndex); // Update the currentIndex in the parent component
  };

  const progressPercentage = ((currentIndex + 1) / total) * 100;

  return (
    <div className="progress-indicator-bar">
      <input
        type="range"
        min="0"
        max={total - 1}
        value={currentIndex}
        onChange={handleChange}
        className="progress-slider"
        style={{
          backgroundSize: `${progressPercentage}% 100%`,
        }}
        aria-label={`Photo ${currentIndex + 1} of ${total}`}
      />
    </div>
  );
};

export default ProgressIndicator;
