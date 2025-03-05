/**
 * QUALITY CHECK:
 * Strengths:
 * - Implements a singleton pattern for Redis connections
 * - Good error handling for missing environment variables
 * - Includes methods for closing connections
 * - Supports testing with mock client injection
 * - Handles both production (Vercel KV) and development environments
 * 
 * Recommendations:
 * - Add JSDoc comments to document functions and parameters
 * - Add more robust error handling for connection failures
 * - Consider implementing connection pooling for high load scenarios
 * - Add retry logic for transient connection issues
 * - Add TypeScript interfaces for Redis operations
 * - Consider adding more Redis utility functions for common operations
 * - Add unit tests for this utility
 */

import Redis from 'ioredis';

let redisClient: Redis | null = null;

export const getRedisClient = (): Redis => {
  if (!redisClient) {
    // Use Vercel KV URL if available (for production)
    const url = process.env.REDIS_URL || process.env.KV_URL;
    
    if (!url) {
      throw new Error('Redis URL not found in environment variables');
    }
    
    redisClient = new Redis(url);
  }
  
  return redisClient;
};

export const closeRedisConnection = async (): Promise<void> => {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
  }
};

// For testing purposes
export const setMockRedisClient = (mockClient: Redis): void => {
  redisClient = mockClient;
}; 