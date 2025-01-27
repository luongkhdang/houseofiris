import { Photo } from "../types";

export const fetchPhotos = async (): Promise<Photo[]> => {
  const response = await fetch("/api/photos");
  if (!response.ok) {
    throw new Error("Failed to fetch photos");
  }
  return await response.json();
};
