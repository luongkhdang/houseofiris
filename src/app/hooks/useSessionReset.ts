/**
 * QUALITY CHECK:
 * Strengths:
 * - Clean and focused custom hook implementation
 * - Good use of useEffect for side effects
 * - Good storage management with sessionStorage
 * - Constant for timeout duration improves maintainability
 * 
 * Recommendations:
 * - Add JSDoc comments to document the hook's purpose, parameters, and return value
 * - Implement better error handling for cases where sessionStorage is not available
 * - Consider using a more robust method for time comparison (e.g., date-fns)
 * - Make TIMEOUT_MINUTES configurable via parameters or environment variables
 * - Add unit tests to verify the hook's behavior in different scenarios
 * - Consider adding a return value (like a reset function) for more flexibility
 */

import { useEffect } from "react";

const TIMEOUT_MINUTES = 15;

export function useSessionReset() {
  useEffect(() => {
    const lastVisit = sessionStorage.getItem("lastVisit");
    const now = Date.now();

    if (lastVisit && now - Number(lastVisit) > TIMEOUT_MINUTES * 60 * 1000) {
      sessionStorage.setItem("lastVisit", now.toString()); // Update timestamp
      window.location.reload(); // Force reload
    } else {
      sessionStorage.setItem("lastVisit", now.toString()); // Store timestamp
    }
  }, []);
}
