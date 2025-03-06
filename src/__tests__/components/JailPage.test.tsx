import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import JailPage from '../../features/home/components/JailPage';

test('renders JailPage', () => {
  render(<JailPage onBack={() => {}} />);
  
  // Check if the button is rendered
  expect(screen.getByText(/Click here to say sowwy!/i)).toBeInTheDocument();
  
  // Check if the image is rendered
  expect(screen.getByAltText('Sad cat')).toBeInTheDocument();
}); 