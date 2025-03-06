/**
 * Photo Component
 * 
 * This component displays a single photo with appropriate styling based on its position
 * (left, center, right). It includes responsive design, animations, and accessibility features.
 */

import React, { useMemo } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Photo as PhotoType } from '../services/photoService';
import { getOptimizedImageUrl, getResponsiveImageSizes, getAspectRatio } from '../utils/imageOptimization';

interface PhotoProps {
  photo: PhotoType;
  position: 'left' | 'center' | 'right';
  isCurrent: boolean;
  dragOffset?: number;
}

const Photo: React.FC<PhotoProps> = ({
  photo,
  position,
  isCurrent,
  dragOffset = 0,
}) => {
  // Calculate position-based styles
  const getPositionStyles = () => {
    const baseStyles = {
      scale: 1,
      x: 0,
      opacity: 1,
      zIndex: 1,
      rotateY: 0,
    };

    switch (position) {
      case 'left':
        return {
          ...baseStyles,
          scale: 0.8,
          x: -120 + (dragOffset * 100),
          opacity: 0.7,
          zIndex: 0,
          rotateY: 15,
        };
      case 'right':
        return {
          ...baseStyles,
          scale: 0.8,
          x: 120 + (dragOffset * 100),
          opacity: 0.7,
          zIndex: 0,
          rotateY: -15,
        };
      default:
        return {
          ...baseStyles,
          scale: 1,
          x: dragOffset * 100,
          opacity: 1,
          zIndex: 2,
          rotateY: dragOffset * -10, // Slight rotation based on drag
        };
    }
  };

  // Memoize optimized image URLs to prevent recalculation on every render
  const optimizedUrls = useMemo(() => getOptimizedImageUrl(photo.url), [photo.url]);
  
  // Get responsive sizes attribute based on current status
  const sizes = useMemo(() => getResponsiveImageSizes(isCurrent), [isCurrent]);
  
  // Calculate aspect ratio for the image
  const aspectRatio = useMemo(() => 
    getAspectRatio(photo.width, photo.height), 
    [photo.width, photo.height]
  );

  const styles = getPositionStyles();

  // Variants for hover animation
  const hoverVariants = {
    hover: { 
      scale: isCurrent ? 1.05 : 0.85,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div
      className={`photo-container absolute ${isCurrent ? 'current' : ''}`}
      animate={styles}
      variants={hoverVariants}
      whileHover="hover"
      transition={{ 
        type: 'spring', 
        stiffness: 300, 
        damping: 30,
        opacity: { duration: 0.2 }
      }}
      role={isCurrent ? 'img' : 'presentation'}
      aria-label={isCurrent ? (photo.title || 'Photo') : undefined}
    >
      <div 
        className="relative rounded-lg overflow-hidden shadow-lg transition-shadow hover:shadow-xl"
        style={{ 
          width: isCurrent ? '100%' : 'auto',
          aspectRatio,
          maxWidth: isCurrent ? '600px' : '300px',
          maxHeight: isCurrent ? '600px' : '300px',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent z-10"></div>
        <Image
          src={isCurrent ? optimizedUrls.fullsize : optimizedUrls.preview}
          alt={photo.title || 'Photo'}
          fill
          sizes={sizes}
          className="object-cover transition-transform"
          priority={isCurrent}
          loading={isCurrent ? 'eager' : 'lazy'}
          placeholder="blur"
          blurDataURL={optimizedUrls.blurDataUrl}
        />
        {isCurrent && (
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent text-white z-10 opacity-0 hover:opacity-100 transition-opacity">
            <h3 className="text-sm font-medium truncate">{photo.title || 'Untitled'}</h3>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Photo; 