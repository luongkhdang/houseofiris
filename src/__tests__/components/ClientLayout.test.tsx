import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ClientLayout from '../../components/layout/ClientLayout';

// Mock the QueryClient
jest.mock('@tanstack/react-query', () => ({
  QueryClientProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-query-provider">{children}</div>
  ),
}));

// Mock the useSessionReset hook
jest.mock('../../app/hooks/useSessionReset', () => ({
  useSessionReset: jest.fn(),
}));

// Mock Timer component
jest.mock('../../components/Timer', () => {
  return function MockTimer() {
    return <div data-testid="mock-timer">Timer Component</div>;
  };
});

// Mock Timers component
jest.mock('../../components/Timers', () => {
  return function MockTimers() {
    return <div data-testid="mock-timers">Timers Component</div>;
  };
});

describe('ClientLayout Component', () => {
  test('renders children and timer components', () => {
    render(
      <ClientLayout>
        <div data-testid="test-child">Test Child</div>
      </ClientLayout>
    );

    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    expect(screen.getByTestId('mock-timer')).toBeInTheDocument();
    expect(screen.getByTestId('mock-timers')).toBeInTheDocument();
  });
}); 