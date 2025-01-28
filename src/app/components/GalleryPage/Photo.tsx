import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Photo as PhotoType } from "./types";

type PhotoProps = {
  photo: PhotoType;
  position: "left" | "center" | "right";
  isCurrent: boolean;
  dragOffset?: number; // Add dragOffset to the type definition
};

const Photo: React.FC<PhotoProps> = ({ photo, position, isCurrent, dragOffset = 0 }) => {
  const [isZoomed, setIsZoomed] = useState(false);

  const handleZoomToggle = () => {
    if (isCurrent) {
      setIsZoomed((prev) => !prev);
      // Toggle overlay
      const overlay = document.querySelector('.zoom-overlay');
      overlay?.classList.toggle('active');
    }
  };

  const variants = {
    left: { scale: 0.8, x: -120 + dragOffset, opacity: 0.5 }, // Adjust x with dragOffset
    center: { scale: 1, x: 0 + dragOffset, opacity: 1 }, // Adjust x with dragOffset
    right: { scale: 0.8, x: 120 + dragOffset, opacity: 0.5 }, // Adjust x with dragOffset
  };

  return (
    <motion.div
      className={`absolute ${isZoomed ? "z-50" : ""}`} // Ensure zoomed image is on top
      initial={variants[position]}
      animate={variants[position]}
      transition={{ duration: 0.3 }}
      onClick={handleZoomToggle} // Toggle zoom on click
      style={{ cursor: isCurrent ? "zoom-in" : "default" }}
    >
      <Image
        src={photo.url}
        alt={photo.title || "Photo"}
        width={isCurrent && isZoomed ? 800 : 380} // Larger size when zoomed
        height={isCurrent && isZoomed ? 800 : 380}
        className={`rounded-xl shadow-lg transition-transform ${
          isZoomed ? "scale-150" : ""
        }`}
        placeholder="blur"
        blurDataURL={photo.url} // Optional placeholder for zooming
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
