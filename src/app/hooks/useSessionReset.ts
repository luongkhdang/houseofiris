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
