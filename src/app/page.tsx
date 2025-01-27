"use client";

import React, { useState } from "react";
import { usePage } from "./hooks/usePage";
import HomePage from "./components/HomePage";
import SecondPage from "./components/SecondPage/";
import GalleryPage from "./components/GalleryPage";
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
