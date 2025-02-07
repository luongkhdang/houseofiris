import React from "react";
import Image from "next/image";
 

interface PicturesViewProps {
  onNext: () => void;
}

const PicturesView: React.FC<PicturesViewProps> = ({ onNext }) => (
  <div className="space-y-4 flex flex-col items-center">
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

    {/* Photo Container with Global CSS */}
    <div className="photo-container">
      <Image
        src="https://res.cloudinary.com/dvmpwccjw/image/upload/v1738893424/Screenshot_20250128_072739_Gallery_lknist.jpg"
        alt="Hai đứa mình"
        width={340}
        height={340}
      />
    </div>
  </div>
);

export default PicturesView;
