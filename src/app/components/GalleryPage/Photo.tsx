import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Photo as PhotoType } from "./types";

type PhotoProps = {
  photo: PhotoType;
  position: "left" | "center" | "right";
  isCurrent: boolean;
  dragOffset?: number;
};

const Photo: React.FC<PhotoProps> = ({ photo, position, isCurrent, dragOffset = 0 }) => {
  const [isZoomed, setIsZoomed] = useState(false);

  const handleZoomToggle = () => {
    if (isCurrent) {
      setIsZoomed((prev) => !prev);
      const overlay = document.querySelector('.zoom-overlay');
      overlay?.classList.toggle('active');
    }
  };

  const variants = {
    left: { 
      scale: 0.8, 
      x: -100 + dragOffset,
      y: 100, 
      opacity: 0.5,
      zIndex: 5 
    },
    center: { 
      scale: 1, 
      x: 0 + dragOffset,
      y: 0, 
      opacity: 1,
      zIndex: 10 
    },
    right: { 
      scale: 0.8, 
      x: 100 + dragOffset,
      y: -100, 
      opacity: 0.5,
      zIndex: 5 
    },
  };

  return (
    <motion.div
      className={`absolute inset-0 flex items-center justify-center ${
        isZoomed ? "z-50" : ""
      }`}
      initial={variants[position]}
      animate={variants[position]}
      transition={{ 
        duration: 0.3,
        zIndex: { duration: 0 } // Instant z-index changes
      }}
      onClick={handleZoomToggle}
      style={{ 
        cursor: isCurrent ? "zoom-in" : "default",
        position: "relative" // Enable z-index
      }}
    >
      <Image
        src={photo.url}
        alt={photo.title || "Photo"}
        width={isZoomed ? 800 : 420}
        height={isZoomed ? 800 : 500}
        className={`rounded-xl shadow-lg transition-transform ${
          isZoomed ? "scale-150" : ""
        }`}
        placeholder="blur"
        blurDataURL={photo.url}
        priority={isCurrent}
        style={{
          objectFit: "contain",
          transition: "transform 0.3s ease-in-out",
        }}
      />
    </motion.div>
  );
};

export default Photo;