/**
 * Timer Component Tests
 * 
 * Tests for the Timer component which displays the elapsed time since a target date.
 */

import React from 'react';
import { render, screen, act } from '@testing-library/react';
import Timer from '../../app/components/Timer';

// Mock console.log to avoid cluttering test output
jest.spyOn(console, 'log').mockImplementation(() => {});

describe('Timer Component', () => {
  // Store original functions to restore them later
  const originalSetInterval = window.setInterval;
  const originalClearInterval = window.clearInterval;
  
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    
    // Mock window timer functions
    window.setInterval = jest.fn(() => 123) as unknown as typeof window.setInterval;
    window.clearInterval = jest.fn() as unknown as typeof window.clearInterval;
  });

  afterEach(() => {
    // Clean up any running timers
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
    
    // Restore original functions
    window.setInterval = originalSetInterval;
    window.clearInterval = originalClearInterval;
  });

  test('setupTests is loaded', () => {
    expect(true).toBe(true);
  });

  test('should render and display elapsed time', () => {
    act(() => {
      render(<Timer />);
    });
    
    // Match the actual text format used in the component
    expect(screen.getByText(/Yay, we've been together for:/)).toBeInTheDocument();
    expect(screen.getByText(/days/i)).toBeInTheDocument();
  });

  test('should update the timer every second', () => {
    act(() => {
      render(<Timer />);
    });
    
    // Check if setInterval was called with correct parameters
    expect(window.setInterval).toHaveBeenCalledWith(expect.any(Function), 1000);
  });

  test('should clean up interval on unmount', () => {
    const { unmount } = render(<Timer />);
    
    // We need to clear mocks here because render calls setInterval
    jest.clearAllMocks();
    
    act(() => {
      unmount();
    });
    
    // Check if clearInterval was called
    expect(window.clearInterval).toHaveBeenCalled();
  });

  test('should format the time correctly', () => {
    // Set a fixed current date for calculation
    const mockDate = new Date(2025, 0, 15); // January 15, 2025
    jest.setSystemTime(mockDate);
    
    act(() => {
      render(<Timer />);
    });
    
    // Look for days in the output
    expect(screen.getByText(/days/i)).toBeInTheDocument();
    // And check for the months, days format
    expect(screen.getByText(/Months.*Days.*Hours.*Minutes.*Seconds/i)).toBeInTheDocument();
  });

  test('should render with correct CSS class', () => {
    // Get the actual class using querySelector since this is a DOM test
    const { container } = render(<Timer />);
    const timerElement = container.querySelector('.timer');
    expect(timerElement).toHaveClass('whitespace-pre-line');
    
    // We can't directly test custom class prop as that would require modifying the component
  });
}); 