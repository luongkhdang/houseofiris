/**
 * QUALITY CHECK:
 * Strengths:
 * - Clean conditional rendering based on page state
 * - Good use of custom hooks for state management
 * - Proper component typing with React.FC
 * - "use client" directive correctly applied for client-side rendering
 * 
 * Recommendations:
 * - Add JSDoc comments to explain component purpose and behavior
 * - Consider extracting the page routing logic to a separate component or hook
 * - Add more semantic HTML structure (e.g., main, section tags)
 * - Missing aria attributes for accessibility
 * - The root div doesn't have any semantic meaning or styling classes
 */

"use client";

import React, { useState } from "react";
import { usePage } from "./hooks/usePage";
import HomePage from "./components/HomePage";
import SecondPage from "./components/SecondPage/";
import GalleryPage from "./components/GalleryPage/";
import JailPage from "./components/JailPage";

const MainPage: React.FC = () => {
  const { currentPage, setCurrentPage } = usePage();
  const [isJailed, setIsJailed] = useState(false);

  if (isJailed) {
    return <JailPage onBack={() => setIsJailed(false)} />;
  }

  return (
    <div>
      {currentPage === "home" && (
        <HomePage
          onNext={() => setCurrentPage("second")}
          onJail={() => setIsJailed(true)}
        />
      )}
      {currentPage === "second" && (
        <SecondPage onNext={() => setCurrentPage("gallery")} />
      )}
      {currentPage === "gallery" && <GalleryPage />}
    </div>
  );
};

export default MainPage;
