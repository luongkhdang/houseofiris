/**
 * Photo Service
 * 
 * This service handles all API calls related to photos and provides
 * React Query hooks for data fetching.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiGet, apiDelete, ApiError } from '../../../services/api';
import { STALE_TIMES, CACHE_TIMES } from '../../../services/queryClient';

// Types
export interface Photo {
  url: string;
  public_id: string;
  folder?: string;
  format?: string;
  width?: number;
  height?: number;
  created_at: string;
  title?: string | null;
  description?: string | null;
  date?: string | null;
  location?: string | null;
}

// API functions
export const fetchPhotos = async (): Promise<Photo[]> => {
  return apiGet<Photo[]>('/photos');
};

export const uploadPhoto = async (formData: FormData): Promise<Photo> => {
  // Using fetch directly here because axios has issues with FormData and file uploads
  const response = await fetch('/api/photos/upload', {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    throw new Error('Failed to upload photo');
  }
  
  return response.json();
};

export const deletePhoto = async (publicId: string): Promise<void> => {
  return apiDelete<void>(`/photos/${publicId}`);
};

// React Query hooks
export const usePhotos = () => {
  return useQuery<Photo[], ApiError>({
    queryKey: ['photos'],
    queryFn: fetchPhotos,
    staleTime: STALE_TIMES.MEDIUM, // Photos change occasionally, so use medium stale time
    gcTime: CACHE_TIMES.EXTENDED, // Keep in cache for extended period
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
  });
};

export const useUploadPhoto = () => {
  const queryClient = useQueryClient();
  
  return useMutation<Photo, ApiError, FormData>({
    mutationFn: uploadPhoto,
    onSuccess: () => {
      // Invalidate the photos query to refetch the list
      queryClient.invalidateQueries({ queryKey: ['photos'] });
    },
    // Optimistic update could be added here for better UX
  });
};

export const useDeletePhoto = () => {
  const queryClient = useQueryClient();
  
  return useMutation<void, ApiError, string>({
    mutationFn: deletePhoto,
    onSuccess: () => {
      // Invalidate the photos query to refetch the list
      queryClient.invalidateQueries({ queryKey: ['photos'] });
    },
    // Optimistic update could be added here for better UX
  });
}; 