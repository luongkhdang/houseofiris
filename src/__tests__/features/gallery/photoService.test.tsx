/**
 * Tests for the photoService API functions
 * This file tests the basic API functions without testing the React Query hooks
 */

import { apiGet, apiPost, apiDelete } from '../../../services/api';
import { fetchPhotos, uploadPhoto, deletePhoto } from '../../../features/gallery/services/photoService';

// Mock the API functions
jest.mock('../../../services/api', () => ({
  apiGet: jest.fn(),
  apiPost: jest.fn(),
  apiDelete: jest.fn(),
}));

// Mock the global fetch function
const originalFetch = global.fetch;
global.fetch = jest.fn();

describe('photoService API functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    // Restore the original fetch function after tests
    global.fetch = originalFetch;
  });

  // Mock photo data
  const mockPhotos = [
    { 
      url: 'https://example.com/photo1.jpg',
      public_id: 'photo1',
      format: 'jpg',
      width: 800,
      height: 600,
      created_at: '2023-01-01',
      title: 'Photo 1',
      description: 'Description 1',
      date: '2023-01-01',
      location: 'Location 1'
    }
  ];

  test('fetchPhotos should call apiGet with the correct endpoint', async () => {
    // Mock the API response
    (apiGet as jest.Mock).mockResolvedValue(mockPhotos);

    // Call the function
    const result = await fetchPhotos();

    // Check that apiGet was called with the correct endpoint
    expect(apiGet).toHaveBeenCalledWith('/photos');
    expect(apiGet).toHaveBeenCalledTimes(1);
    
    // Check that the function returns the expected result
    expect(result).toEqual(mockPhotos);
  });

  test('uploadPhoto should call fetch with the correct endpoint and data', async () => {
    // Create a mock FormData
    const mockFormData = new FormData();
    
    // Mock the fetch response
    const mockJsonPromise = Promise.resolve({ success: true, photo: mockPhotos[0] });
    const mockFetchResponse = {
      ok: true,
      json: () => mockJsonPromise
    };
    (global.fetch as jest.Mock).mockResolvedValue(mockFetchResponse);

    // Call the function
    const result = await uploadPhoto(mockFormData);

    // Check that fetch was called with the correct endpoint and data
    expect(global.fetch).toHaveBeenCalledWith('/api/photos/upload', {
      method: 'POST',
      body: mockFormData
    });
    expect(global.fetch).toHaveBeenCalledTimes(1);
    
    // Check that the function returns the expected result
    expect(result).toEqual({ success: true, photo: mockPhotos[0] });
  });

  test('deletePhoto should call apiDelete with the correct endpoint', async () => {
    // Mock the API response
    (apiDelete as jest.Mock).mockResolvedValue({ success: true });

    // Call the function
    const publicId = 'photo1';
    const result = await deletePhoto(publicId);

    // Check that apiDelete was called with the correct endpoint
    expect(apiDelete).toHaveBeenCalledWith(`/photos/${publicId}`);
    expect(apiDelete).toHaveBeenCalledTimes(1);
    
    // Check that the function returns the expected result
    expect(result).toEqual({ success: true });
  });
});

// Skip React Query hooks tests for now
describe.skip('photoService React Query Hooks', () => {
  // Tests will be implemented later
}); 