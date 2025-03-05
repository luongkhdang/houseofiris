/**
 * QUALITY CHECK:
 * Strengths:
 * - Clean and concise hook implementation
 * - Good use of TypeScript with proper typing for the Page type
 * - Follows React hooks best practices
 * - Simple state management without unnecessary complexity
 * 
 * Recommendations:
 * - Add JSDoc comments to document the hook's purpose, parameters, and return value
 * - Consider using a more descriptive name (e.g., usePageNavigation)
 * - Consider persisting the current page in localStorage/sessionStorage to preserve state on refresh
 * - Add unit tests for this hook
 * - Consider expanding the type to include more possible pages as the application grows
 */

import { useState } from 'react';

export type Page = 'home' | 'second' | 'gallery';

export const usePage = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  return { currentPage, setCurrentPage };
};
