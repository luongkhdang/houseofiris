import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomePage from '../../features/home/components/HomePage';

test('renders HomePage', () => {
  render(<HomePage onNext={() => {}} onJail={() => {}} />);
  
  // Check if the main question is rendered
  expect(screen.getByText('Do you love me?')).toBeInTheDocument();
  
  // Check if both buttons are rendered
  expect(screen.getByText(/A little/i)).toBeInTheDocument();
  expect(screen.getByText(/I love you a lot/i)).toBeInTheDocument();
}); 