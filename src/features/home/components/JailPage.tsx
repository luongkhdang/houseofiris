"use client";

import React, { useState } from "react";
import Image from "next/image";

interface JailPageProps {
  onBack: () => void;
}

const JailPage: React.FC<JailPageProps> = ({ onBack }) => {
  const [clickCount, setClickCount] = useState(0);

  const handleButtonClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);

    if (newCount >= 10) {
      onBack(); // Redirect after 10 clicks
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white font-mono">
      {/* Sad Cat Image */}
      <div className="mb-6">
        <Image
          src="/sad-cat.png" // Public folder image
          alt="Sad cat"
          width={200}
          height={200}
          className="rounded shadow-lg"
          priority
        />
      </div>

      {/* Button to Grow and Redirect */}
      <button
        className="border border-white rounded bg-red-500 text-black font-bold hover:bg-red-400"
        onClick={handleButtonClick}
        style={{
          padding: `${1 + clickCount * 0.2}rem`, // Grow padding with clicks
          fontSize: `${1 + clickCount * 0.1}rem`, // Grow font size with clicks
        }}
      >
        Click here to say sowwy!
      </button>
    </div>
  );
};

export default JailPage; 