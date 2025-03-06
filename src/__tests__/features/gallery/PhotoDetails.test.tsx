/**
 * Tests for the PhotoDetails component
 * 
 * This file contains tests for the PhotoDetails component, including
 * rendering photo information and handling optional fields.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PhotoDetails from '../../../features/gallery/components/PhotoDetails';
import { Photo } from '../../../features/gallery/services/photoService';

describe('PhotoDetails Component', () => {
  // Sample photo data for testing
  const mockPhoto: Photo = {
    url: 'https://example.com/photo1.jpg',
    public_id: 'photo1',
    created_at: '2023-01-01T12:00:00Z',
    title: 'Test Photo 1',
    description: 'Description for test photo 1',
    location: 'Test Location 1',
  };
  
  it('should render the photo title and description', () => {
    render(<PhotoDetails photo={mockPhoto} />);
    
    expect(screen.getByText('Test Photo 1')).toBeInTheDocument();
    expect(screen.getByText('Description for test photo 1')).toBeInTheDocument();
  });
  
  it('should render the photo location', () => {
    render(<PhotoDetails photo={mockPhoto} />);
    
    expect(screen.getByText('Test Location 1')).toBeInTheDocument();
  });
  
  it('should render the photo date in a formatted way', () => {
    render(<PhotoDetails photo={mockPhoto} />);
    
    // The date format might vary, so we'll check for the year
    expect(screen.getByText(/2023/)).toBeInTheDocument();
  });
  
  it('should handle a photo without a description', () => {
    const photoWithoutDescription = {
      ...mockPhoto,
      description: undefined,
    };
    
    render(<PhotoDetails photo={photoWithoutDescription} />);
    
    expect(screen.getByText('Test Photo 1')).toBeInTheDocument();
    expect(screen.queryByText('Description for test photo 1')).not.toBeInTheDocument();
  });
  
  it('should handle a photo without a location', () => {
    const photoWithoutLocation = {
      ...mockPhoto,
      location: undefined,
    };
    
    render(<PhotoDetails photo={photoWithoutLocation} />);
    
    expect(screen.getByText('Test Photo 1')).toBeInTheDocument();
    expect(screen.queryByText('Test Location 1')).not.toBeInTheDocument();
  });
}); 