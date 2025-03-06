/**
 * Tests for the photoService
 * 
 * This file contains tests for the photoService, including
 * API functions and React Query hooks.
 */

import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { 
  fetchPhotos, 
  uploadPhoto, 
  deletePhoto,
  usePhotos,
  useUploadPhoto,
  useDeletePhoto,
  Photo
} from '../../../features/gallery/services/photoService';
import React from 'react';

// Mock the API functions
jest.mock('../../../lib/api', () => ({
  apiGet: jest.fn(),
  apiPost: jest.fn(),
  apiDelete: jest.fn(),
}));

// Import the mocked API functions
const { apiGet, apiPost, apiDelete } = jest.requireMock('../../../lib/api');

describe('photoService API Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('fetchPhotos should call apiGet with correct endpoint', async () => {
    (apiGet as jest.Mock).mockResolvedValue([]);
    
    await fetchPhotos();
    
    expect(apiGet).toHaveBeenCalledWith('/photos');
    expect(apiGet).toHaveBeenCalledTimes(1);
  });
  
  it('uploadPhoto should call apiPost with correct endpoint and data', async () => {
    const photoData = new FormData();
    photoData.append('title', 'Test Photo');
    photoData.append('description', 'Test Description');
    
    (apiPost as jest.Mock).mockResolvedValue({
      url: 'https://example.com/photo.jpg',
      public_id: 'test_id',
      title: 'Test Photo',
      description: 'Test Description',
      location: 'Test Location'
    });
    
    await uploadPhoto(photoData);
    
    expect(apiPost).toHaveBeenCalledWith('/photos', photoData);
    expect(apiPost).toHaveBeenCalledTimes(1);
  });
  
  it('deletePhoto should call apiDelete with correct endpoint', async () => {
    const photoId = 'test_id';
    
    (apiDelete as jest.Mock).mockResolvedValue({});
    
    await deletePhoto(photoId);
    
    expect(apiDelete).toHaveBeenCalledWith(`/photos/${photoId}`);
    expect(apiDelete).toHaveBeenCalledTimes(1);
  });
});

// Wrapper for testing hooks
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('photoService React Query Hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('usePhotos should call fetchPhotos and return data', async () => {
    const mockPhotos: Photo[] = [
      {
        url: 'https://example.com/photo1.jpg',
        public_id: 'photo1',
        created_at: '2023-01-01T12:00:00Z',
        title: 'Test Photo 1',
        description: 'Description for test photo 1',
        location: 'Test Location 1',
      }
    ];
    
    (apiGet as jest.Mock).mockResolvedValue(mockPhotos);
    
    const { result } = renderHook(() => usePhotos(), {
      wrapper: createWrapper(),
    });
    
    // Initially in loading state
    expect(result.current.isLoading).toBe(true);
    
    // Wait for the query to resolve
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    expect(result.current.data).toEqual(mockPhotos);
    expect(apiGet).toHaveBeenCalledWith('/photos');
  });
  
  it('useUploadPhoto should return a mutation function', async () => {
    const photoData = new FormData();
    photoData.append('title', 'Test Photo');
    photoData.append('description', 'Test Description');
    
    (apiPost as jest.Mock).mockResolvedValue({
      url: 'https://example.com/photo.jpg',
      public_id: 'test_id',
      title: 'Test Photo',
      description: 'Test Description',
      location: 'Test Location'
    });
    
    const { result } = renderHook(() => useUploadPhoto(), {
      wrapper: createWrapper(),
    });
    
    expect(result.current.mutate).toBeDefined();
    expect(typeof result.current.mutate).toBe('function');
  });
  
  it('useDeletePhoto should return a mutation function', async () => {
    (apiDelete as jest.Mock).mockResolvedValue({});
    
    const { result } = renderHook(() => useDeletePhoto(), {
      wrapper: createWrapper(),
    });
    
    expect(result.current.mutate).toBeDefined();
    expect(typeof result.current.mutate).toBe('function');
  });
}); 