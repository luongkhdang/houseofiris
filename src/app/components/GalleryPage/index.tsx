/**
 * QUALITY CHECK:
 * Strengths:
 * - Clear "use client" directive for client-side rendering
 * - Good use of React Query for data fetching
 * - Well-structured component with proper TypeScript typing
 * - Clean implementation of drag and swipe functionality
 * - Good error and empty state handling
 * - Nice use of Framer Motion for animations
 * 
 * Recommendations:
 * - Add JSDoc comments to document component purpose and behavior
 * - Extract drag handling logic to a custom hook for reusability
 * - Add loading state visualization beyond just using placeholders
 * - Implement accessibility features (keyboard navigation, ARIA attributes)
 * - Consider adding lazy loading for images
 * - Add unit tests for this component
 * - Consider adding prop types for better documentation
 * - Add memoization for performance optimization
 */

"use client";

import React, { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, PanInfo } from "framer-motion";
import Photo from "./Photo";
import ProgressIndicator from "./ProgressIndicator";
import PhotoDetails from "./PhotoDetails";
import { fetchPhotos } from "./services/photoService";
import { placeholderPhotos } from "./constants";

const SWIPE_THRESHOLD = 50;
const GalleryPage: React.FC = () => {
  const {
    data: photos,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["photos"],
    queryFn: fetchPhotos,
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragStart, setDragStart] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const activePhotos = isLoading ? placeholderPhotos : photos || [];
  const currentPhoto = activePhotos[currentIndex];
  const previousPhoto =
    activePhotos[
      (currentIndex - 1 + activePhotos.length) % activePhotos.length
    ];
  const nextPhoto = activePhotos[(currentIndex + 1) % activePhotos.length];

  const handleDragStart = (_: unknown, info: PanInfo) => {
    setDragStart(info.point.x);
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const dragDistance = info.point.x - dragStart;
    if (Math.abs(dragDistance) > SWIPE_THRESHOLD) {
      setCurrentIndex((prev) =>
        dragDistance > 0
          ? (prev - 1 + activePhotos.length) % activePhotos.length
          : (prev + 1) % activePhotos.length
      );
    }
    setDragOffset(0);
  };

  const handleDrag = (_: unknown, info: PanInfo) => {
    setDragOffset(info.point.x - dragStart);
  };

  const handleIndexChange = (newIndex: number) => {
    setCurrentIndex(newIndex);
  };

  if (isError) {
    return (
      <div className="container flex items-center justify-center text-red-500">
        <p>Failed to load photos. Please try again later.</p>
      </div>
    );
  }

  if (activePhotos.length === 0) {
    return (
      <div className="container flex items-center justify-center">
        <p>No photos available.</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div
        className="relative flex justify-center items-center h-3/4"
        ref={containerRef}
      >
        <Photo
          photo={previousPhoto}
          position="left"
          isCurrent={false}
          dragOffset={dragOffset}
        />
        <motion.div
          className="center-photo"
          drag="x"
          dragConstraints={containerRef}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDrag={handleDrag}
          style={{ x: dragOffset }}
        >
          <Photo photo={currentPhoto} position="center" isCurrent={true} />
        </motion.div>
        <Photo
          photo={nextPhoto}
          position="right"
          isCurrent={false}
          dragOffset={dragOffset}
        />
      </div>
      <PhotoDetails photo={currentPhoto} />
      <ProgressIndicator
        total={activePhotos.length}
        currentIndex={currentIndex}
        onChange={handleIndexChange} // Handle index changes from slider
      />
    </div>
  );
};

export default GalleryPage;
