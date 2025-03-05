import React from 'react';
import { render, screen } from '@testing-library/react';
import HomePage from '../../app/components/HomePage';

test('renders HomePage', () => {
  render(<HomePage onNext={() => {}} onJail={() => {}} />);
  const linkElement = screen.getByText(/Do you love me?/i);
  expect(linkElement).toBeInTheDocument();
}); 