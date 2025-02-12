import React from "react";
import { ViewType } from "./types";
import PicturesView from "./views/PicturesView";
import FeedbackView from "./views/FeedbackView";
import ScheduleView from "./views/ScheduleView";
import StickerView from "./views/StickerView"

interface ViewContainerProps {
  currentView: ViewType;
  onNext: () => void;
}

const ViewContainer: React.FC<ViewContainerProps> = ({ currentView, onNext }) => {
  const views = {
    pictures: <PicturesView onNext={onNext} />,
    feedback: <FeedbackView />,
    schedule: <ScheduleView />,
    sticker: <StickerView />
  };

  return (
    <div className="view-container">
      {views[currentView]}
    </div>
  );
};

export default ViewContainer;