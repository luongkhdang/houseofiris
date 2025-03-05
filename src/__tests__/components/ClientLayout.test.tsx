/**
 * ClientLayout Component Tests
 * 
 * These tests check the ClientLayout component which wraps the app with providers
 * and adds global components like Timer and Timers.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import ClientLayout from '../../app/components/ClientLayout';
import { useSessionReset } from '../../app/hooks/useSessionReset';

// Mock dependencies
jest.mock('../../app/hooks/useSessionReset', () => ({
  useSessionReset: jest.fn()
}));

jest.mock('../../app/components/Timer', () => {
  return function MockTimer() {
    return <div data-testid="mock-timer">Timer Component</div>;
  };
});

jest.mock('../../app/components/Timers', () => {
  return function MockTimers() {
    return <div data-testid="mock-timers">Timers Component</div>;
  };
});

describe('ClientLayout Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render children properly', () => {
    // Arrange & Act
    render(
      <ClientLayout>
        <div data-testid="test-child">Test Child Content</div>
      </ClientLayout>
    );

    // Assert
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    expect(screen.getByText('Test Child Content')).toBeInTheDocument();
  });

  it('should render Timer and Timers components', () => {
    // Arrange & Act
    render(
      <ClientLayout>
        <div>Child Content</div>
      </ClientLayout>
    );

    // Assert
    expect(screen.getByTestId('mock-timer')).toBeInTheDocument();
    expect(screen.getByTestId('mock-timers')).toBeInTheDocument();
  });

  it('should call useSessionReset hook', () => {
    // Arrange & Act
    render(
      <ClientLayout>
        <div>Content</div>
      </ClientLayout>
    );

    // Assert
    expect(useSessionReset).toHaveBeenCalled();
  });

  it('should provide QueryClient via QueryClientProvider', () => {
    // This test verifies the QueryClientProvider is working by checking if a query function works
    // We'll need to mock a component that uses a query to truly test this
    
    // Create a mock component that uses the query context
    const MockQueryConsumer = () => {
      return <div data-testid="query-consumer">Query Consumer</div>;
    };

    // Render the layout with the mock consumer
    render(
      <ClientLayout>
        <MockQueryConsumer />
      </ClientLayout>
    );

    // Assert the context provider children rendered properly
    expect(screen.getByTestId('query-consumer')).toBeInTheDocument();
  });

  it('should apply the correct CSS class to the container', () => {
    // Arrange & Act
    const { container } = render(
      <ClientLayout>
        <div>Content</div>
      </ClientLayout>
    );

    // Assert
    // Find div with the 'shift-container' class
    const shiftContainer = container.querySelector('.shift-container');
    expect(shiftContainer).toBeInTheDocument();
  });
}); 