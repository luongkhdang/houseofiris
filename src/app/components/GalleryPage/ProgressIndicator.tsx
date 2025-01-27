import React from "react";

type ProgressIndicatorProps = {
  total: number;
  currentIndex: number;
};

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  total,
  currentIndex,
}) => (
  <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2">
    {Array.from({ length: total }).map((_, index) => (
      <div
        key={index}
        className={`w-2 h-2 rounded-full transition-colors duration-300 ${
          index === currentIndex ? "bg-white" : "bg-gray-500"
        }`}
      />
    ))}
  </div>
);

export default ProgressIndicator;
