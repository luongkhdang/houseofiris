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
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Import components dynamically with loading fallbacks
const DynamicHomePage = dynamic(() => import('../features/home/components/HomePage'), {
  loading: () => <LoadingSpinner />,
  ssr: true,
});

const DynamicSecondPage = dynamic(() => import("./components/SecondPage/"), {
  loading: () => <LoadingSpinner />,
  ssr: true,
});

const DynamicGalleryPage = dynamic(() => import("./components/GalleryPage/"), {
  loading: () => <LoadingSpinner />,
  ssr: false, // Disable SSR for gallery to reduce initial load time
});

const DynamicJailPage = dynamic(() => import("../features/home/components/JailPage"), {
  loading: () => <LoadingSpinner />,
  ssr: true,
});

// Loading spinner component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

const MainPage: React.FC = () => {
  const { currentPage, setCurrentPage } = usePage();
  const [isJailed, setIsJailed] = useState(false);

  if (isJailed) {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <DynamicJailPage onBack={() => setIsJailed(false)} />
      </Suspense>
    );
  }

  return (
    <div>
      {currentPage === "home" && (
        <Suspense fallback={<LoadingSpinner />}>
          <DynamicHomePage
            onNext={() => setCurrentPage("second")}
            onJail={() => setIsJailed(true)}
          />
        </Suspense>
      )}
      {currentPage === "second" && (
        <Suspense fallback={<LoadingSpinner />}>
          <DynamicSecondPage onNext={() => setCurrentPage("gallery")} />
        </Suspense>
      )}
      {currentPage === "gallery" && (
        <Suspense fallback={<LoadingSpinner />}>
          <DynamicGalleryPage />
        </Suspense>
      )}
    </div>
  );
};

export default MainPage;
