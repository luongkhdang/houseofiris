/**
 * Timer Component Tests
 * 
 * Tests for the Timer component which displays the elapsed time since a target date.
 */

import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Timer from '../../components/Timer';

// Mock console.log to avoid cluttering test output
jest.spyOn(console, 'log').mockImplementation(() => {});

// Mock Date.now to return a fixed timestamp
const mockDate = new Date('2023-01-01T00:00:00Z');
jest.spyOn(global, 'Date').mockImplementation(() => mockDate as unknown as Date);

describe('Timer Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders timer with elapsed time', () => {
    render(<Timer />);
    
    // Check if the timer element is in the document
    const timerElement = screen.getByText(/Yay, we've been together for:/i);
    expect(timerElement).toBeInTheDocument();
  });

  test('updates timer every second', () => {
    jest.useFakeTimers();
    
    render(<Timer />);
    
    // Advance timer by 1 second
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    // Check if the timer is still in the document after update
    const timerElement = screen.getByText(/Yay, we've been together for:/i);
    expect(timerElement).toBeInTheDocument();
    
    jest.useRealTimers();
  });

  test('cleans up interval on unmount', () => {
    const clearIntervalSpy = jest.spyOn(window, 'clearInterval');
    
    const { unmount } = render(<Timer />);
    unmount();
    
    expect(clearIntervalSpy).toHaveBeenCalled();
    clearIntervalSpy.mockRestore();
  });
}); 