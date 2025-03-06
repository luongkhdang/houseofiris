/**
 * Image Optimization Utilities
 * 
 * This file contains utility functions for optimizing images,
 * particularly for Cloudinary-hosted images.
 */

/**
 * Generates optimized image URLs for different purposes
 * 
 * @param url The original Cloudinary image URL
 * @returns Object containing optimized URLs for different use cases
 */
export const getOptimizedImageUrl = (url: string): {
  thumbnail: string;
  preview: string;
  fullsize: string;
  blurDataUrl: string;
} => {
  // Check if this is a Cloudinary URL
  if (!url.includes('cloudinary.com')) {
    return {
      thumbnail: url,
      preview: url,
      fullsize: url,
      blurDataUrl: url,
    };
  }

  // For Cloudinary images, apply transformations
  const cloudinaryBase = url.split('/upload/')[0];
  const imagePath = url.split('/upload/')[1];

  if (!cloudinaryBase || !imagePath) {
    return {
      thumbnail: url,
      preview: url,
      fullsize: url,
      blurDataUrl: url,
    };
  }

  return {
    // Small thumbnail for lists (80x80)
    thumbnail: `${cloudinaryBase}/upload/c_thumb,w_80,h_80,q_auto:good,f_auto/${imagePath}`,
    
    // Medium size for previews (400x400)
    preview: `${cloudinaryBase}/upload/c_fill,w_400,h_400,q_auto:good,f_auto/${imagePath}`,
    
    // Full size with quality optimization (max 1200px width)
    fullsize: `${cloudinaryBase}/upload/c_limit,w_1200,q_auto:best,f_auto/${imagePath}`,
    
    // Tiny blurred placeholder (10x10)
    blurDataUrl: `${cloudinaryBase}/upload/c_thumb,w_10,h_10,q_30,e_blur:1000,f_auto/${imagePath}`,
  };
};

/**
 * Determines the appropriate image size based on viewport
 * 
 * @param viewportWidth The current viewport width
 * @returns The appropriate image size descriptor for the sizes attribute
 */
export const getResponsiveImageSizes = (isCurrent: boolean): string => {
  if (isCurrent) {
    return '(max-width: 640px) 90vw, (max-width: 768px) 70vw, (max-width: 1024px) 50vw, 800px';
  }
  return '(max-width: 640px) 30vw, (max-width: 768px) 25vw, 20vw';
};

/**
 * Calculates the aspect ratio for an image
 * 
 * @param width Image width
 * @param height Image height
 * @returns The aspect ratio as a string (e.g., "16/9")
 */
export const getAspectRatio = (width?: number, height?: number): string => {
  if (!width || !height) return '1/1';
  return `${width}/${height}`;
}; 