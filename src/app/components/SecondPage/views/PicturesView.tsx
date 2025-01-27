import React from "react";

interface PicturesViewProps {
  onNext: () => void;
}

const PicturesView: React.FC<PicturesViewProps> = ({ onNext }) => (
  <div className="space-y-4">
    <h1 className="text-2xl font-bold">Hai đứa mình !</h1>
    <button
      className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
      onClick={onNext}
    >
      Click here for pictures
    </button>
  </div>
);

export default PicturesView;