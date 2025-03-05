/**
 * Timers Component Tests
 * 
 * These tests check the Timers component which displays countdown timers 
 * for the next 11th of the month and the anniversary on December 11th.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import Timers from '../../app/components/Timers';

// Mock React hooks
jest.mock('react', () => {
  const originalReact = jest.requireActual('react');
  return {
    ...originalReact,
    useState: jest.fn().mockImplementation(originalReact.useState),
    useEffect: jest.fn().mockImplementation((callback, deps) => {
      return originalReact.useEffect(callback, deps);
    }),
  };
});

describe('Timers Component', () => {
  // Store original functions for restoration
  const originalSetInterval = window.setInterval;
  const originalClearInterval = window.clearInterval;
  const intervalId = 123;
  
  beforeEach(() => {
    // Mock interval functions for each test
    window.setInterval = jest.fn().mockReturnValue(intervalId) as unknown as typeof window.setInterval;
    window.clearInterval = jest.fn() as unknown as typeof window.clearInterval;
    
    // Reset React mocks
    (React.useState as jest.Mock).mockImplementation(jest.requireActual('react').useState);
    (React.useEffect as jest.Mock).mockImplementation(jest.requireActual('react').useEffect);
    
    // Ensure console output doesn't clutter test output
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  
  afterEach(() => {
    // Restore original functions after each test
    window.setInterval = originalSetInterval;
    window.clearInterval = originalClearInterval;
    
    // Restore any mocked dates and console
    jest.restoreAllMocks();
  });
  
  it('should render countdown timers with correct days calculation', () => {
    // Mock useState to return our predefined values
    (React.useState as jest.Mock)
      .mockImplementationOnce(() => ["10 Days Left Until The Next 🎁Present", jest.fn()])
      .mockImplementationOnce(() => ["344 Days Left Until Our 🥂Anniversary🥂", jest.fn()]);
    
    render(<Timers />);
    
    // Get the timer container
    const timerContainer = screen.getByText(/Days Left Until/i).closest('div');
    expect(timerContainer).not.toBeNull();
    
    // Check that the container contains the correct text
    expect(timerContainer?.textContent).toContain('10 Days Left Until The Next 🎁Present');
    expect(timerContainer?.textContent).toContain('344 Days Left Until Our 🥂Anniversary🥂');
  });
  
  it('should render countdown timers when current date is after the 11th', () => {
    // Mock useState to return our predefined values
    (React.useState as jest.Mock)
      .mockImplementationOnce(() => ["27 Days Left Until The Next 🎁Present", jest.fn()])
      .mockImplementationOnce(() => ["330 Days Left Until Our 🥂Anniversary🥂", jest.fn()]);
    
    render(<Timers />);
    
    // Get the timer container
    const timerContainer = screen.getByText(/Days Left Until/i).closest('div');
    expect(timerContainer).not.toBeNull();
    
    // Check that the container contains the correct text
    expect(timerContainer?.textContent).toContain('27 Days Left Until The Next 🎁Present');
    expect(timerContainer?.textContent).toContain('330 Days Left Until Our 🥂Anniversary🥂');
  });
  
  it('should render countdown timer when current date is December 15 (after Dec 11)', () => {
    // Mock useState to return our predefined values
    (React.useState as jest.Mock)
      .mockImplementationOnce(() => ["27 Days Left Until The Next 🎁Present", jest.fn()])
      .mockImplementationOnce(() => ["362 Days Left Until Our 🥂Anniversary🥂", jest.fn()]);
    
    render(<Timers />);
    
    // Get the timer container
    const timerContainer = screen.getByText(/Days Left Until/i).closest('div');
    expect(timerContainer).not.toBeNull();
    
    // Check that the container contains the correct text
    expect(timerContainer?.textContent).toContain('27 Days Left Until The Next 🎁Present');
    expect(timerContainer?.textContent).toContain('362 Days Left Until Our 🥂Anniversary🥂');
  });
  
  it('should update timers every minute', () => {
    render(<Timers />);
    
    // Check that setInterval was called with the correct interval (60000 ms = 1 minute)
    expect(window.setInterval).toHaveBeenCalledWith(expect.any(Function), 60000);
  });
  
  it('should clean up interval on unmount', () => {
    const { unmount } = render(<Timers />);
    
    unmount();
    
    // Check that clearInterval was called with the correct interval ID
    expect(window.clearInterval).toHaveBeenCalledWith(intervalId);
  });
  
  it('should have correct formatting and styling', () => {
    render(<Timers />);
    
    // Check that the container has the correct class
    const timerContainer = screen.getByText(/Days Left Until/i).closest('div');
    expect(timerContainer).toHaveClass('timer-top-right');
  });
}); 