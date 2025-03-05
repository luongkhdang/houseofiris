/**
 * QUALITY CHECK:
 * Strengths:
 * - Clean initialization of the Cloudinary SDK
 * - Good use of environment variables for configuration
 * - Properly sets secure flag for HTTPS usage
 * - Single responsibility principle followed
 * 
 * Recommendations:
 * - Add error handling for cases where environment variables are missing
 * - Add TypeScript typing for the cloudinary object
 * - Consider adding a wrapper or service class with typed methods
 * - Document available methods and use cases
 * - Add fallback values or validation for environment variables
 * - Consider a more robust configuration pattern that supports different environments
 */

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;
