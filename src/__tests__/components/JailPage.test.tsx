import React from 'react';
import { render, screen } from '@testing-library/react';
import JailPage from '../../app/components/JailPage';

test('renders JailPage', () => {
  render(<JailPage onBack={() => {}} />);
  const linkElement = screen.getByText(/Click here to say sowwy!/i);
  expect(linkElement).toBeInTheDocument();
}); 