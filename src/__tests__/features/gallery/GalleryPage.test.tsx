/**
 * Tests for the GalleryPage component
 * 
 * This file contains tests for the GalleryPage component, including
 * loading states, error handling, and user interactions.
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'; // Import jest-dom for the toBeInTheDocument matcher
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import GalleryPage from '../../../features/gallery/components/GalleryPage';
import { usePhotos } from '../../../features/gallery/services/photoService';
import { Photo } from '../../../features/gallery/services/photoService';

// Mock the photoService hooks
jest.mock('../../../features/gallery/services/photoService', () => ({
  usePhotos: jest.fn(),
  Photo: jest.requireActual('../../../features/gallery/services/photoService').Photo,
}));

// Mock framer-motion to avoid animation-related issues in tests
jest.mock('framer-motion', () => {
  const actual = jest.requireActual('framer-motion');
  return {
    ...actual,
    motion: {
      ...actual.motion,
      div: ({ children, ...props }: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) => (
        <div {...props}>{children}</div>
      ),
    },
    AnimatePresence: ({ children }: React.PropsWithChildren<unknown>) => <>{children}</>,
  };
});

describe('GalleryPage Component', () => {
  let queryClient: QueryClient;
  
  // Sample photo data for testing
  const mockPhotos: Photo[] = [
    {
      url: 'https://example.com/photo1.jpg',
      public_id: 'photo1',
      created_at: '2023-01-01T12:00:00Z',
      title: 'Test Photo 1',
      description: 'Description for test photo 1',
      location: 'Test Location 1',
    },
    {
      url: 'https://example.com/photo2.jpg',
      public_id: 'photo2',
      created_at: '2023-01-02T12:00:00Z',
      title: 'Test Photo 2',
      description: 'Description for test photo 2',
      location: 'Test Location 2',
    },
  ];
  
  beforeEach(() => {
    // Create a new QueryClient for each test
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    
    // Reset all mocks
    jest.clearAllMocks();
  });
  
  it('should show loading state when fetching photos', () => {
    // Mock the usePhotos hook to return loading state
    (usePhotos as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
      isError: false,
    });
    
    render(
      <QueryClientProvider client={queryClient}>
        <GalleryPage />
      </QueryClientProvider>
    );
    
    // Check if loading indicator is displayed
    expect(screen.getByText(/Loading beautiful memories/i)).toBeInTheDocument();
  });
  
  it('should display photos when data is loaded', async () => {
    // Mock the usePhotos hook to return data
    (usePhotos as jest.Mock).mockReturnValue({
      data: mockPhotos,
      isLoading: false,
      error: null,
      isError: false,
    });
    
    render(
      <QueryClientProvider client={queryClient}>
        <GalleryPage />
      </QueryClientProvider>
    );
    
    // Check if the title is displayed
    expect(screen.getByText('Our Gallery')).toBeInTheDocument();
    
    // Check if photo details are displayed
    expect(screen.getByText('Test Photo 1')).toBeInTheDocument();
  });
  
  it('should display error message when there is an error', () => {
    // Mock the usePhotos hook to return error
    (usePhotos as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Failed to fetch photos'),
      isError: true,
    });
    
    render(
      <QueryClientProvider client={queryClient}>
        <GalleryPage />
      </QueryClientProvider>
    );
    
    // Check if error message is displayed
    expect(screen.getByText(/Error loading photos/i)).toBeInTheDocument();
    expect(screen.getByText(/We couldn't load the photos at this time/i)).toBeInTheDocument();
  });
  
  it('should navigate to next photo when clicking next button', async () => {
    // Mock the usePhotos hook to return data
    (usePhotos as jest.Mock).mockReturnValue({
      data: mockPhotos,
      isLoading: false,
      error: null,
      isError: false,
    });
    
    render(
      <QueryClientProvider client={queryClient}>
        <GalleryPage />
      </QueryClientProvider>
    );
    
    // Find and click the next button
    const nextButton = screen.getByLabelText('Next photo');
    fireEvent.click(nextButton);
    
    // Check if the second photo is now displayed
    await waitFor(() => {
      expect(screen.getByText('Test Photo 2')).toBeInTheDocument();
    });
  });
  
  it('should navigate to previous photo when clicking previous button', async () => {
    // Mock the usePhotos hook to return data
    (usePhotos as jest.Mock).mockReturnValue({
      data: mockPhotos,
      isLoading: false,
      error: null,
      isError: false,
    });
    
    render(
      <QueryClientProvider client={queryClient}>
        <GalleryPage />
      </QueryClientProvider>
    );
    
    // First go to the second photo
    const nextButton = screen.getByLabelText('Next photo');
    fireEvent.click(nextButton);
    
    // Then go back to the first photo
    const prevButton = screen.getByLabelText('Previous photo');
    fireEvent.click(prevButton);
    
    // Check if the first photo is displayed again
    await waitFor(() => {
      expect(screen.getByText('Test Photo 1')).toBeInTheDocument();
    });
  });
  
  it('should navigate photos using keyboard arrow keys', async () => {
    // Mock the usePhotos hook to return data
    (usePhotos as jest.Mock).mockReturnValue({
      data: mockPhotos,
      isLoading: false,
      error: null,
      isError: false,
    });
    
    render(
      <QueryClientProvider client={queryClient}>
        <GalleryPage />
      </QueryClientProvider>
    );
    
    // Simulate right arrow key press to go to next photo
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    
    // Check if the second photo is displayed
    await waitFor(() => {
      expect(screen.getByText('Test Photo 2')).toBeInTheDocument();
    });
    
    // Simulate left arrow key press to go back to first photo
    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    
    // Check if the first photo is displayed again
    await waitFor(() => {
      expect(screen.getByText('Test Photo 1')).toBeInTheDocument();
    });
  });
}); 