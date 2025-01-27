import React from "react";
import { Photo } from "./types";

type PhotoDetailsProps = {
  photo: Photo;
};

const PhotoDetails: React.FC<PhotoDetailsProps> = ({ photo }) => (
  <div className="text-description">
    <p>{photo.title || "Untitled"}</p>
    <p>{photo.date || "Date not provided"}</p>
    <p>{photo.location || "Location not available"}</p>
  </div>
);

export default PhotoDetails;
