/**
 * Tests for the GalleryPage component
 * 
 * This file contains tests for the GalleryPage component, including
 * loading states, error handling, and navigation.
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import GalleryPage from '../../../features/gallery/components/GalleryPage';
import { usePhotos } from '../../../features/gallery/services/photoService';

// Mock the usePhotos hook
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
    AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
    useMotionValue: () => ({
      get: jest.fn(),
      set: jest.fn(),
    }),
    useTransform: () => ({
      get: jest.fn(),
      onChange: (callback: (v: number) => void) => {
        callback(0);
        return jest.fn();
      },
    }),
  };
});

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ComponentProps<'img'>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

describe('GalleryPage Component', () => {
  // Sample photo data for testing
  const mockPhotos = [
    {
      url: 'https://example.com/photo1.jpg',
      public_id: 'photo1',
      created_at: '2023-01-01T12:00:00Z',
      title: 'Test Photo 1',
      description: 'Description for test photo 1',
      location: 'Test Location 1',
      date: '01/01/2023',
    },
    {
      url: 'https://example.com/photo2.jpg',
      public_id: 'photo2',
      created_at: '2023-01-02T12:00:00Z',
      title: 'Test Photo 2',
      description: 'Description for test photo 2',
      location: 'Test Location 2',
      date: '01/02/2023',
    },
  ];
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('should display loading state when data is loading', () => {
    // Mock the usePhotos hook to return loading state
    (usePhotos as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    });
    
    const queryClient = new QueryClient();
    
    render(
      <QueryClientProvider client={queryClient}>
        <GalleryPage />
      </QueryClientProvider>
    );
    
    expect(screen.getByText(/Loading beautiful memories/i)).toBeInTheDocument();
  });
  
  it('should display photos when data is loaded', () => {
    // Mock the usePhotos hook to return data
    (usePhotos as jest.Mock).mockReturnValue({
      data: mockPhotos,
      isLoading: false,
      error: null,
    });
    
    const queryClient = new QueryClient();
    
    render(
      <QueryClientProvider client={queryClient}>
        <GalleryPage />
      </QueryClientProvider>
    );
    
    // Check if the title is displayed
    expect(screen.getByText('Our Gallery')).toBeInTheDocument();
    
    // Check if photo details are displayed - use a more specific selector
    expect(screen.getByRole('heading', { name: 'Test Photo 1', level: 2 })).toBeInTheDocument();
  });
  
  it('should display error message when there is an error', () => {
    // Mock the usePhotos hook to return error
    (usePhotos as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Failed to fetch photos'),
      isError: true,
    });
    
    const queryClient = new QueryClient();
    
    render(
      <QueryClientProvider client={queryClient}>
        <GalleryPage />
      </QueryClientProvider>
    );
    
    expect(screen.getByText(/Error loading photos/i)).toBeInTheDocument();
    expect(screen.getByText(/We couldn't load the photos at this time/i)).toBeInTheDocument();
  });
  
  it('should navigate to next photo when clicking next button', async () => {
    // Mock the usePhotos hook to return data
    (usePhotos as jest.Mock).mockReturnValue({
      data: mockPhotos,
      isLoading: false,
      error: null,
    });
    
    const queryClient = new QueryClient();
    
    render(
      <QueryClientProvider client={queryClient}>
        <GalleryPage />
      </QueryClientProvider>
    );
    
    // Find and click the next button
    const nextButton = screen.getByLabelText('Next photo');
    fireEvent.click(nextButton);
    
    // Check if the second photo is now displayed by looking for its title in the details section
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Test Photo 2', level: 2 })).toBeInTheDocument();
    });
  });
  
  it('should navigate to previous photo when clicking previous button', async () => {
    // Mock the usePhotos hook to return data
    (usePhotos as jest.Mock).mockReturnValue({
      data: mockPhotos,
      isLoading: false,
      error: null,
    });
    
    const queryClient = new QueryClient();
    
    render(
      <QueryClientProvider client={queryClient}>
        <GalleryPage />
      </QueryClientProvider>
    );
    
    // Go to the second photo first
    const nextButton = screen.getByLabelText('Next photo');
    fireEvent.click(nextButton);
    
    // Then go back to the first photo
    const prevButton = screen.getByLabelText('Previous photo');
    fireEvent.click(prevButton);
    
    // Check if the first photo is displayed again by looking for its title in the details section
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Test Photo 1', level: 2 })).toBeInTheDocument();
    });
  });
  
  it('should navigate photos using keyboard arrow keys', async () => {
    // Mock the usePhotos hook to return data
    (usePhotos as jest.Mock).mockReturnValue({
      data: mockPhotos,
      isLoading: false,
      error: null,
    });
    
    const queryClient = new QueryClient();
    
    render(
      <QueryClientProvider client={queryClient}>
        <GalleryPage />
      </QueryClientProvider>
    );
    
    // Simulate right arrow key press to go to next photo
    fireEvent.keyDown(document, { key: 'ArrowRight' });
    
    // Check if the second photo is displayed by looking for its title in the details section
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Test Photo 2', level: 2 })).toBeInTheDocument();
    });
    
    // Simulate left arrow key press to go back to first photo
    fireEvent.keyDown(document, { key: 'ArrowLeft' });
    
    // Check if the first photo is displayed again by looking for its title in the details section
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Test Photo 1', level: 2 })).toBeInTheDocument();
    });
  });
}); 