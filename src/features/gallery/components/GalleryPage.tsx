/**
 * GalleryPage Component
 * 
 * This component displays a gallery of photos with swipe navigation and details.
 * It includes responsive design, keyboard navigation, and smooth animations.
 */

"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { usePhotos } from '../services/photoService';
import { Photo as PhotoType } from '../services/photoService';
import Photo from './Photo';
import ProgressIndicator from './ProgressIndicator';
import PhotoDetails from './PhotoDetails';
import { placeholderPhotos } from '../constants';

const GalleryPage: React.FC = () => {
  // State for current photo index
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Motion values for drag interaction
  const x = useMotionValue(0);
  const dragProgress = useTransform(x, [-200, 0, 200], [-1, 0, 1]);
  
  // State to store the current drag value
  const [dragValue, setDragValue] = useState(0);
  
  // Update dragValue when dragProgress changes
  useEffect(() => {
    const unsubscribe = dragProgress.onChange(value => {
      setDragValue(value);
    });
    return () => unsubscribe();
  }, [dragProgress]);
  
  // Fetch photos using React Query
  const { data: photos, isLoading, error, isError } = usePhotos();
  
  // Use placeholder photos if data is loading or there's an error
  const displayPhotos: PhotoType[] = photos || placeholderPhotos;
  
  // Handle drag end event
  const handleDragEnd = () => {
    const currentDragValue = dragProgress.get();
    
    if (currentDragValue < -0.5) {
      // Dragged left - go to next photo
      goToNextPhoto();
    } else if (currentDragValue > 0.5) {
      // Dragged right - go to previous photo
      goToPreviousPhoto();
    }
    
    // Reset drag position
    x.set(0);
  };
  
  // Navigation functions
  const goToNextPhoto = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % displayPhotos.length);
  }, [displayPhotos.length]);
  
  const goToPreviousPhoto = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + displayPhotos.length) % displayPhotos.length);
  }, [displayPhotos.length]);
  
  // Handle index change from progress indicator
  const handleIndexChange = (index: number) => {
    setCurrentIndex(index);
  };
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        goToNextPhoto();
      } else if (e.key === 'ArrowLeft') {
        goToPreviousPhoto();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNextPhoto, goToPreviousPhoto]);
  
  // If there's an error, display error message
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h2 className="text-xl font-bold text-red-500 mb-2">Error loading photos</h2>
          <p className="text-gray-600 mb-4">We couldn&apos;t load the photos at this time.</p>
          <p className="text-sm text-gray-500">{error instanceof Error ? error.message : 'Please try again later'}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="gallery-container flex flex-col min-h-screen p-4 md:p-6 lg:p-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Our Gallery</h1>
      
      {/* Main gallery area */}
      <div className="flex-grow relative overflow-hidden rounded-xl bg-gray-50">
        {/* Loading indicator */}
        <AnimatePresence>
          {isLoading && (
            <motion.div 
              className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-90 z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-600">Loading beautiful memories...</p>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Draggable container */}
        <motion.div
          className="h-full flex items-center justify-center"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          style={{ x }}
          role="region"
          aria-label="Photo gallery"
          tabIndex={0}
        >
          {/* Previous photo */}
          {displayPhotos.length > 1 && (
            <Photo
              photo={displayPhotos[(currentIndex - 1 + displayPhotos.length) % displayPhotos.length]}
              position="left"
              isCurrent={false}
              dragOffset={dragValue}
            />
          )}
          
          {/* Current photo */}
          {displayPhotos.length > 0 && (
            <Photo
              photo={displayPhotos[currentIndex]}
              position="center"
              isCurrent={true}
              dragOffset={dragValue}
            />
          )}
          
          {/* Next photo */}
          {displayPhotos.length > 1 && (
            <Photo
              photo={displayPhotos[(currentIndex + 1) % displayPhotos.length]}
              position="right"
              isCurrent={false}
              dragOffset={dragValue}
            />
          )}
        </motion.div>
        
        {/* Navigation buttons for accessibility */}
        <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 flex justify-between px-4 pointer-events-none">
          <button 
            onClick={goToPreviousPhoto}
            className="bg-white bg-opacity-70 hover:bg-opacity-100 rounded-full p-2 shadow-md text-gray-800 transition-all pointer-events-auto focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Previous photo"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            onClick={goToNextPhoto}
            className="bg-white bg-opacity-70 hover:bg-opacity-100 rounded-full p-2 shadow-md text-gray-800 transition-all pointer-events-auto focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Next photo"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Photo details with animation */}
      <AnimatePresence mode="wait">
        {displayPhotos.length > 0 && (
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <PhotoDetails photo={displayPhotos[currentIndex]} />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Progress indicator */}
      {displayPhotos.length > 0 && (
        <ProgressIndicator
          total={displayPhotos.length}
          currentIndex={currentIndex}
          onChange={handleIndexChange}
        />
      )}
    </div>
  );
};

export default GalleryPage; 