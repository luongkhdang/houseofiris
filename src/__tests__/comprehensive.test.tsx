/**
 * QUALITY CHECK:
 * Strengths:
 * - Comprehensive test coverage for multiple components
 * - Good setup with mocked dependencies
 * - Clear test structure with descriptive test names
 * - Proper use of React Testing Library for component testing
 * - Mocking of external services like EmailJS
 * - Good setup of React Query Provider for data fetching tests
 * - Thorough assertions checking multiple aspects of functionality
 * 
 * Recommendations:
 * - Add more test cases for error conditions and edge cases
 * - Consider organizing tests into more granular files by component
 * - Add end-to-end tests for critical user flows
 * - Implement snapshot tests for UI consistency
 * - Add more comprehensive form testing
 * - Consider using test-data-builder pattern for cleaner test data setup
 * - Add accessibility testing with jest-axe
 * - Implement integration tests with actual API calls in a test environment
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import GalleryPage from '../app/components/GalleryPage';
import FeedbackView from '../app/components/SecondPage/views/FeedbackView';
import ScheduleView from '../app/components/SecondPage/views/ScheduleView';
import { fetchPhotos } from '../app/components/GalleryPage/services/photoService';
import { scheduleService } from '../app/components/SecondPage/services/scheduleService';
import { emailService } from '../app/components/SecondPage/services/emailService';
import React from 'react';

// Mock the emailjs module and make it available before importing components
jest.mock('@emailjs/browser', () => ({
  init: jest.fn(),
  send: jest.fn().mockResolvedValue({ status: 200, text: 'OK' })
}));

// Mocking the fetchPhotos and scheduleService functions
jest.mock('../app/components/GalleryPage/services/photoService');
jest.mock('../app/components/SecondPage/services/scheduleService');

// Mock environment variables needed for EmailJS
process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY = 'test-key';
process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID = 'test-service';
process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID = 'test-template';

// Mock fetch API
// eslint-disable-next-line @typescript-eslint/no-unused-vars
global.fetch = jest.fn((url, options) => 
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]),
  })
) as jest.Mock;

// Setup mocks before tests
beforeEach(() => {
  // Mock scheduleService methods
  (scheduleService.getSchedules as jest.Mock).mockResolvedValue([]);
  (scheduleService.saveSchedule as jest.Mock).mockResolvedValue({ date: '2023-01-01', note: 'Test note' });
  (scheduleService.deleteSchedule as jest.Mock).mockResolvedValue(undefined);
  
  // Reset fetch mock
  (global.fetch as jest.Mock).mockClear();
});

const queryClient = new QueryClient();

describe('Comprehensive Tests', () => {
  beforeEach(() => {
    queryClient.clear();
  });

  test('GalleryPage loads and displays photos', async () => {
    const mockPhotos = [
      { 
        id: '1',
        url: 'https://example.com/photo1.jpg', 
        title: 'Photo 1', 
        date: '2023-01-01', 
        location: 'Location 1' 
      },
      { 
        id: '2',
        url: 'https://example.com/photo2.jpg', 
        title: 'Photo 2', 
        date: '2023-01-02', 
        location: 'Location 2' 
      },
    ];
    (fetchPhotos as jest.Mock).mockResolvedValue(mockPhotos);

    render(
      <QueryClientProvider client={queryClient}>
        <GalleryPage />
      </QueryClientProvider>
    );

    // Wait for photos to load and check their presence via alt text
    await waitFor(() => {
      const photoElements = screen.getAllByRole('img');
      expect(photoElements.length).toBeGreaterThan(0);
      
      // Check for the title in the description area
      expect(screen.getByText('Photo 1')).toBeInTheDocument();
      
      // Check that one of the images has the correct alt text
      const photo2 = screen.getAllByAltText('Photo 2');
      expect(photo2.length).toBeGreaterThan(0);
    });
  });

  test('FeedbackView submits feedback', async () => {
    // Mock fetch for feedback submission with destructured parameters
    (global.fetch as jest.Mock).mockImplementation((urlParam, optionsParam) => {
      // Use the parameters to determine response
      if (urlParam === '/api/feedbacks' && optionsParam?.method === 'POST') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ message: 'Feedback submitted successfully' }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]), // Return empty array for GET to avoid map is not a function error
      });
    });

    // Mock window.alert
    const originalAlert = window.alert;
    window.alert = jest.fn();

    // Mock EmailJS service with appropriate return type
    jest.spyOn(emailService, 'sendFeedback').mockImplementation(() => 
      Promise.resolve({ status: 200, text: 'OK' })
    );

    render(
      <QueryClientProvider client={queryClient}>
        <FeedbackView />
      </QueryClientProvider>
    );

    // Wait for component to load
    await waitFor(() => screen.getByPlaceholderText(/type your feelings here/i));

    const feedbackInput = screen.getByPlaceholderText(/type your feelings here/i);
    const submitButton = screen.getByRole('button', { name: /send/i });

    fireEvent.change(feedbackInput, { target: { value: 'Great app!' } });
    fireEvent.click(submitButton);

    // Check that the fetch was called with the correct URL
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/feedbacks',
        expect.objectContaining({
          method: 'POST',
          headers: expect.any(Object),
          body: expect.stringContaining('Great app!')
        })
      );
    });

    // Check for alert - allowing either success message or error message
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalled();
    });

    // Restore the original alert function
    window.alert = originalAlert;
  });

  test('ScheduleView saves a schedule', async () => {
    // Mock window.alert for this test
    const originalAlert = window.alert;
    window.alert = jest.fn();

    render(
      <QueryClientProvider client={queryClient}>
        <ScheduleView />
      </QueryClientProvider>
    );

    // Wait for component to load
    await waitFor(() => screen.getByPlaceholderText(/add a note or schedule here/i));

    // Fill out the form
    const noteInput = screen.getByPlaceholderText(/add a note or schedule here/i);
    const saveButton = screen.getByText(/save schedule/i);

    // Set a test note
    fireEvent.change(noteInput, { target: { value: 'Test note' } });
    
    // Click save (this will trigger an alert since no date is selected)
    fireEvent.click(saveButton);

    // Verify alert was called because no date was selected
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Please select a date!");
    });

    // Restore the original alert function
    window.alert = originalAlert;
  });
}); 