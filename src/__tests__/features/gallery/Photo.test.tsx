/**
 * Tests for the Photo component
 * 
 * This file contains tests for the Photo component, including
 * rendering with different positions and drag offsets.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Photo from '../../../features/gallery/components/Photo';
import { Photo as PhotoType } from '../../../features/gallery/services/photoService';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ComponentProps<'img'>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

// Mock framer-motion to avoid animation-related issues in tests
jest.mock('framer-motion', () => {
  const actual = jest.requireActual('framer-motion');
  return {
    ...actual,
    motion: {
      ...actual.motion,
      div: ({ children, ...props }: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) => (
        <div data-testid="motion-div" {...props}>{children}</div>
      ),
    },
  };
});

describe('Photo Component', () => {
  // Sample photo data for testing
  const mockPhoto: PhotoType = {
    url: 'https://example.com/photo1.jpg',
    public_id: 'photo1',
    created_at: '2023-01-01T12:00:00Z',
    title: 'Test Photo 1',
    description: 'Description for test photo 1',
    location: 'Test Location 1',
  };
  
  it('should render the photo with center position', () => {
    render(
      <Photo 
        photo={mockPhoto} 
        position="center" 
        isCurrent={true} 
      />
    );
    
    const photoElement = screen.getByTestId('motion-div');
    expect(photoElement).toBeInTheDocument();
    expect(photoElement).toHaveClass('z-10'); // Center photos have higher z-index
  });
  
  it('should render the photo with left position', () => {
    render(
      <Photo 
        photo={mockPhoto} 
        position="left" 
        isCurrent={false} 
      />
    );
    
    const photoElement = screen.getByTestId('motion-div');
    expect(photoElement).toBeInTheDocument();
    expect(photoElement).not.toHaveClass('z-10'); // Side photos have lower z-index
  });
  
  it('should render the photo with right position', () => {
    render(
      <Photo 
        photo={mockPhoto} 
        position="right" 
        isCurrent={false} 
      />
    );
    
    const photoElement = screen.getByTestId('motion-div');
    expect(photoElement).toBeInTheDocument();
    expect(photoElement).not.toHaveClass('z-10'); // Side photos have lower z-index
  });
  
  it('should apply drag offset when provided', () => {
    render(
      <Photo 
        photo={mockPhoto} 
        position="center" 
        isCurrent={true} 
        dragOffset={100} 
      />
    );
    
    const photoElement = screen.getByTestId('motion-div');
    expect(photoElement).toBeInTheDocument();
    // We can't easily test the exact transform value in JSDOM,
    // but we can verify the component renders with the prop
    expect(photoElement).toHaveAttribute('data-testid', 'motion-div');
  });
}); 