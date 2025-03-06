import React from 'react';
import { Photo } from '../services/photoService';

interface PhotoDetailsProps {
  photo: Photo;
}

const PhotoDetails: React.FC<PhotoDetailsProps> = ({ photo }) => {
  return (
    <div className="mt-4 text-center">
      <h2 className="text-xl font-semibold text-gray-800">{photo.title}</h2>
      {photo.description && (
        <p className="mt-2 text-gray-600">{photo.description}</p>
      )}
      {photo.location && (
        <p className="mt-1 text-sm text-gray-500">
          <span className="inline-block mr-1">📍</span>
          {photo.location}
        </p>
      )}
      {photo.created_at && (
        <p className="mt-1 text-xs text-gray-400">
          {new Date(photo.created_at).toLocaleDateString()}
        </p>
      )}
    </div>
  );
};

export default PhotoDetails;
