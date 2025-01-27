"use client";

import React, { useState } from "react";
import ViewContainer from "./ViewContainer";
import ViewSelector from "./ViewSelector";
import { ViewType } from "./types";

interface SecondPageProps {
  onNext: () => void;
}

const SecondPage: React.FC<SecondPageProps> = ({ onNext }) => {
  const [view, setView] = useState<ViewType>("pictures");

  return (
    <div className="second-page-wrapper">
      <div className="second-page-container">
        <ViewSelector currentView={view} onViewChange={setView} />
        <ViewContainer currentView={view} onNext={onNext} />
      </div>
    </div>
  );
};

export default SecondPage;
