/**
 * Test Utilities
 * 
 * This file contains common test utilities and helpers for testing.
 */

import React from 'react';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

/**
 * Renders a component with all necessary providers
 */
export function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false
      }
    }
  });

  const AllProviders = ({ children }: { children: React.ReactNode }) => {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  };

  return render(ui, { wrapper: AllProviders });
}

/**
 * Mocks the Date object for testing
 */
export function mockDate(date: Date | string | number) {
  const originalDate = global.Date;
  const mockDateObj = new Date(date);

  // @ts-expect-error - this is a mock
  global.Date = class extends originalDate {
    constructor() {
      super();
      return new originalDate(mockDateObj);
    }

    static now() {
      return new originalDate(mockDateObj).getTime();
    }
  };

  return {
    restore: () => {
      global.Date = originalDate;
    }
  };
}

/**
 * Test data for common entities
 */
export const testData = {
  photos: [
    {
      id: 'photo1',
      url: 'https://example.com/photo1.jpg',
      title: 'Test Photo 1',
      createdAt: '2023-01-01T12:00:00Z'
    },
    {
      id: 'photo2',
      url: 'https://example.com/photo2.jpg',
      title: 'Test Photo 2',
      createdAt: '2023-01-02T12:00:00Z'
    }
  ],
  
  schedules: [
    {
      id: 'schedule1',
      title: 'Test Schedule 1',
      date: '2023-12-25T12:00:00Z',
      description: 'Christmas celebration'
    },
    {
      id: 'schedule2',
      title: 'Test Schedule 2',
      date: '2023-12-31T23:00:00Z',
      description: 'New Year celebration'
    }
  ],
  
  feedbacks: [
    {
      id: 'feedback1',
      name: 'Test User 1',
      email: 'test1@example.com',
      message: 'Great app!',
      createdAt: '2023-01-01T12:00:00Z'
    },
    {
      id: 'feedback2',
      name: 'Test User 2',
      email: 'test2@example.com',
      message: 'Needs improvement',
      createdAt: '2023-01-02T12:00:00Z'
    }
  ]
};

/**
 * Sets up common API mocks
 */
export function setupApiMocks(fetchMock: jest.SpyInstance) {
  // Reset existing mocks
  fetchMock.mockReset();
  
  // Setup mock API responses
  fetchMock.mockImplementation((url: string) => {
    if (typeof url !== 'string') {
      return mockNotFoundResponse();
    }
    
    if (url.includes('/api/photos')) {
      return Promise.resolve({
        ok: true,
        json: async () => ({ photos: testData.photos })
      });
    }
    
    if (url.includes('/api/schedules')) {
      return Promise.resolve({
        ok: true,
        json: async () => ({ schedules: testData.schedules })
      });
    }
    
    if (url.includes('/api/feedbacks')) {
      return Promise.resolve({
        ok: true,
        json: async () => ({ feedbacks: testData.feedbacks })
      });
    }
    
    return mockNotFoundResponse();
  });
  
  return fetchMock;
}

/**
 * Creates a mock 404 response
 */
function mockNotFoundResponse() {
  return Promise.resolve({
    ok: false,
    status: 404,
    json: async () => ({ error: 'Not found' })
  });
}

// Additional test helpers
export const waitForMs = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Export testing utilities from testing-library for convenience
export * from '@testing-library/react';
export { act } from 'react-dom/test-utils'; 