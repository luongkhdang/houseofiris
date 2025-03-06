/**
 * React Query Client Configuration
 * 
 * This file configures the React Query client with optimized caching strategies
 * and default options for queries and mutations.
 */

import { QueryClient } from '@tanstack/react-query';

// Default stale times for different types of data
export const STALE_TIMES = {
  NEVER: Infinity,
  LONG: 24 * 60 * 60 * 1000, // 24 hours
  MEDIUM: 5 * 60 * 1000, // 5 minutes
  SHORT: 30 * 1000, // 30 seconds
};

// Default cache times for different types of data
export const CACHE_TIMES = {
  NORMAL: 5 * 60 * 1000, // 5 minutes
  EXTENDED: 60 * 60 * 1000, // 1 hour
  LONG: 24 * 60 * 60 * 1000, // 24 hours
};

// Create and configure the query client
export const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: STALE_TIMES.MEDIUM,
        gcTime: CACHE_TIMES.EXTENDED,
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        retry: 3,
        retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
      },
      mutations: {
        retry: 2,
        retryDelay: 1000,
      },
    },
  });
};

// Export a singleton instance for client-side usage
export const queryClient = createQueryClient(); 