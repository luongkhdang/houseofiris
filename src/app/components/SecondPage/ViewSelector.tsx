import React from "react";
import { ViewType } from "./types";

interface ViewSelectorProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const ViewSelector: React.FC<ViewSelectorProps> = ({ currentView, onViewChange }) => {
  const views: ViewType[] = ["pictures","sticker", "feedback", "schedule"];

  return (
    <div className="view-selector">
      {views.map((view) => (
        <button
          key={view}
          className={`view-selector__button ${
            currentView === view ? "view-selector__button--active" : ""
          }`}
          onClick={() => onViewChange(view)}
        >
          {view.charAt(0).toUpperCase() + view.slice(1)}
        </button>
      ))}
    </div>
  );
};

export default ViewSelector;