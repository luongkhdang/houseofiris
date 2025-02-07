import React from "react";

interface PicturesViewProps {
  onNext: () => void;
}

const PicturesView: React.FC<PicturesViewProps> = ({ onNext }) => (
  <div className="space-y-4">
    {/* Header and Button Container */}
    <div className="header-container flex flex-col items-center gap-4">
      <h1 className="text-2xl font-bold">Hai đứa mình !</h1>
      <button
        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        onClick={onNext}
      >
        Click here for pictures
      </button>
    </div>

    {/* Additional Content Container */}
    <div className="extra-content">
      {/* You can add images, text, or any other content here */}
    </div>
  </div>
);

export default PicturesView;
