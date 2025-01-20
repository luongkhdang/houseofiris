"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence, PanInfo } from "framer-motion";

type Photo = {
  url: string;
  public_id: string;
  format: string;
  width: number;
  height: number;
  created_at: string;
};

const placeholderPhotos: Photo[] = [
  {
    url: "https://res.cloudinary.com/dvmpwccjw/image/upload/w_200,q_30/v1736668069/photo2_biuabn.jpg",
    public_id: "photo2_biuabn",
    format: "jpg",
    width: 2667,
    height: 3187,
    created_at: "2025-01-12T07:47:49+00:00",
  },
];

const fetchPhotos = async (): Promise<Photo[]> => {
  const response = await fetch("/api/photos");
  if (!response.ok) {
    throw new Error("Failed to fetch photos");
  }
  return await response.json();
};

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
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(
    null
  );
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (_: unknown, info: PanInfo) => {
    setDragStart(info.point.x);
  };
  
  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const activePhotos = photos || placeholderPhotos;
    const dragDistance = info.point.x - dragStart;
    if (Math.abs(dragDistance) > SWIPE_THRESHOLD) {
      if (dragDistance > 0) {
        setCurrentIndex(
          (prev) => (prev - 1 + activePhotos.length) % activePhotos.length
        );
        setSwipeDirection("right");
      } else {
        setCurrentIndex((prev) => (prev + 1) % activePhotos.length);
        setSwipeDirection("left");
      }
    }
    setDragOffset(0);
  };
  
  const handleDrag = (_: unknown, info: PanInfo) => {
    setDragOffset(info.point.x - dragStart);
  };
  

  if (isError) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        <p>Failed to load photos. Please try again later.</p>
      </div>
    );
  }

  const activePhotos = isLoading ? placeholderPhotos : photos || [];
  if (activePhotos.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        <p>No photos available.</p>
      </div>
    );
  }

  const currentPhoto = activePhotos[currentIndex];
  const previousPhoto =
    activePhotos[
      (currentIndex - 1 + activePhotos.length) % activePhotos.length
    ];
  const nextPhoto = activePhotos[(currentIndex + 1) % activePhotos.length];

  const getOptimizedUrl = (url: string, isMain: boolean) => {
    if (isMain) {
      return url.replace(
        "/upload/",
        `/upload/q_auto:best,dpr_2,f_auto,w_1290,h_1290,c_crop,g_auto/`
      );
    }
    return url.replace(
      "/upload/",
      `/upload/q_auto:eco,f_auto,w_400,h_400,c_fill/`
    );
  };

  return (
    <div className="h-screen w-full sm:w-[390px] sm:h-[844px] bg-black overflow-hidden">
      <div
        className="relative flex justify-center items-center h-3/4"
        ref={containerRef}
      >
        {/* Previous Photo */}
        <motion.div
          className="absolute left-0"
          initial={{ scale: 0.8, x: -120, opacity: 0.5 }}
          animate={{
            scale: 0.8,
            x: -120,
            opacity: swipeDirection === "left" ? 0.9 : 0.5,
          }}
          transition={{ duration: 0.3 }}
          style={{ zIndex: 1 }}
        >
          <Image
            unoptimized
            src={getOptimizedUrl(previousPhoto.url, false)}
            alt={`Previous Photo`}
            width={swipeDirection === "left" ? 340 : 300}
            height={swipeDirection === "left" ? 340 : 300}
            className="rounded-xl shadow-lg"
            style={{ objectFit: "cover" }}
          />
        </motion.div>

        {/* Current Photo */}
        <motion.div
          className="z-10  flex justify-center  m-4"
          drag="x"
          dragConstraints={containerRef}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDrag={handleDrag}
          style={{ x: dragOffset }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 1.2 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              transition={{ duration: 0.3 }}
            >
               
                <Image
                  unoptimized
                  src={getOptimizedUrl(currentPhoto.url, true)}
                  alt={`Photo ${currentIndex + 1} of ${activePhotos.length}`}
                  width={380}
                  height={380}
                  className="rounded-xl shadow-lg object-contain"
                  style={{
                    maxHeight: "70vh",
                    width: "auto",
                    objectFit: "contain",
                  }}
                  priority={true}
                />
               
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Next Photo */}
        <motion.div
          className="z-10 flex justify-center items-center"
          initial={{ scale: 0.8, x: 120, opacity: 0.5 }}
          animate={{
            scale: 0.8,
            x: 120,
            opacity: swipeDirection === "right" ? 0.9 : 0.5,
          }}
          transition={{ duration: 0.3 }}
          style={{ zIndex: 1 }}
        >
          <Image
            unoptimized
            src={getOptimizedUrl(nextPhoto.url, false)}
            alt={`Next Photo`}
            width={swipeDirection === "right" ? 340 : 300}
            height={swipeDirection === "right" ? 340 : 300}
            className="rounded-xl shadow-lg"
            style={{ objectFit: "cover" }}
          />
        </motion.div>
      </div>

      {/* Progress Indicator */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2">
        {activePhotos.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              index === currentIndex ? "bg-white" : "bg-gray-500"
            }`}
          />
        ))}
      </div>
      
    </div>
  );
};

export default GalleryPage;
