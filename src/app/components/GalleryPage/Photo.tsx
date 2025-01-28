import React, { useState, useRef } from "react";
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
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoomToggle = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isCurrent) return;

    if (!isZoomed) {
      // Getting click position
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Calculate zoom origin as percentages
        const originX = (x / rect.width) * 100;
        const originY = (y / rect.height) * 100;
        
        // Apply zoom origin to the container
        if (containerRef.current) {
          containerRef.current.style.setProperty('--zoom-x', `${originX}%`);
          containerRef.current.style.setProperty('--zoom-y', `${originY}%`);
        }
      }
    }

    setIsZoomed((prev) => !prev);
    
    // Toggle overlay
    const overlay = document.querySelector('.zoom-overlay');
    overlay?.classList.toggle('active');
  };

  // Close zoom when clicking outside
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && isZoomed) {
      handleZoomToggle(e);
    }
  };

  const variants = {
    left: { scale: 0.8, x: -120 + dragOffset, opacity: 0.5 },
    center: { scale: 1, x: 0 + dragOffset, opacity: 1 },
    right: { scale: 0.8, x: 120 + dragOffset, opacity: 0.5 },
  };

  return (
    <>
      <motion.div
        ref={containerRef}
        className={`absolute ${isZoomed ? "zoomed" : ""}`}
        initial={variants[position]}
        animate={variants[position]}
        transition={{ duration: 0.3 }}
        onClick={handleZoomToggle}
        style={{ cursor: isCurrent ? "zoom-in" : "default" }}
      >
        <Image
          src={photo.url}
          alt={photo.title || "Photo"}
          width={380}
          height={380}
          className="rounded-xl shadow-lg transition-transform"
          placeholder="blur"
          blurDataURL={photo.url}
          priority={isCurrent}
          style={{
            objectFit: "contain",
            transition: "transform 0.3s ease-in-out",
          }}
        />
      </motion.div>
      {isZoomed && (
        <div 
          className="zoom-overlay active" 
          onClick={handleOverlayClick}
        />
      )}
    </>
  );
};

export default Photo;