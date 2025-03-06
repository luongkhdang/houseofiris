/**
 * Timers Component Tests
 * 
 * These tests check the Timers component which displays countdown timers 
 * for the next 11th of the month and the anniversary on December 11th.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Timers from '../../components/Timers';

// Mock React hooks
jest.mock('react', () => {
  const originalReact = jest.requireActual('react');
  return {
    ...originalReact,
    useState: jest.fn()
      .mockImplementationOnce(() => ["10 Days Left Until The Next 🎁Present", jest.fn()])
      .mockImplementationOnce(() => ["30 Days Left Until Our 🥂Anniversary🥂", jest.fn()]),
    useEffect: jest.fn().mockImplementation(cb => cb()),
  };
});

describe('Timers Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders countdown timers', () => {
    render(<Timers />);
    
    // The timer-top-right class should be present
    const timerContainer = screen.getByText(/10 Days Left Until The Next/i).closest('div');
    expect(timerContainer).toHaveClass('timer-top-right');
  });

  test('displays both countdown timers', () => {
    // Reset the mock to provide the same values for the second test
    jest.spyOn(React, 'useState')
      .mockImplementationOnce(() => ["10 Days Left Until The Next 🎁Present", jest.fn()])
      .mockImplementationOnce(() => ["30 Days Left Until Our 🥂Anniversary🥂", jest.fn()]);
      
    render(<Timers />);
    
    // Check for both countdown texts using regex to avoid emoji encoding issues
    expect(screen.getByText(/10 Days Left Until The Next/i)).toBeInTheDocument();
    expect(screen.getByText(/30 Days Left Until Our/i)).toBeInTheDocument();
  });
}); 