/**
 * QUALITY CHECK:
 * Strengths:
 * - Clean and minimal QueryClient initialization
 * - Follows React Query best practices with a shared client instance
 * - Single responsibility principle followed
 * 
 * Recommendations:
 * - Add configuration options for the QueryClient (e.g., staleTime, cacheTime)
 * - Consider adding TypeScript types for the QueryClient configuration
 * - Document the purpose and usage of the QueryClient
 * - Consider moving to the new @tanstack/react-query package naming
 * - Add default error handling and logging configuration
 * - Consider adding custom hooks that utilize this QueryClient
 */

import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient();
