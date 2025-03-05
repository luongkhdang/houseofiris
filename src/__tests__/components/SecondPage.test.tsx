import React from 'react';
import { render, screen } from '@testing-library/react';
import SecondPage from '../../app/components/SecondPage';

test('renders SecondPage', () => {
  render(<SecondPage onNext={() => {}} />);
  const linkElement = screen.getByText(/Hai đứa mình/i);
  expect(linkElement).toBeInTheDocument();
}); 