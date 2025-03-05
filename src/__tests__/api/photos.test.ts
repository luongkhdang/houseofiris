import { GET } from '../../app/api/photos/route';
import cloudinary from '../../app/lib/cloudinary';

// Mock the cloudinary API
jest.mock('../../app/lib/cloudinary', () => ({
  search: {
    expression: jest.fn().mockReturnThis(),
    max_results: jest.fn().mockReturnThis(),
    with_field: jest.fn().mockReturnThis(),
    execute: jest.fn().mockResolvedValue({
      resources: [
        {
          secure_url: 'https://example.com/photo1.jpg',
          public_id: 'photo1',
          folder: 'test',
          format: 'jpg',
          width: 800,
          height: 600,
          created_at: '2023-01-01T12:00:00Z',
          context: {
            alt: 'Test Photo 1',
            caption: 'Test Caption 1',
            Date: '01/01/2023',
            Location: 'Test Location 1'
          }
        }
      ]
    })
  }
}));

describe('Photos API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return photos on GET', async () => {
    const response = await GET();
    
    // Check that cloudinary.search was called
    expect(cloudinary.search.expression).toHaveBeenCalledWith('resource_type:image');
    
    // Verify response
    expect(response).toBeDefined();
    
    // Extract the JSON from the mocked response
    const responseData = await response.json();
    
    // Check the structure of the response
    expect(responseData[0]).toHaveProperty('url');
    expect(responseData[0]).toHaveProperty('title', 'Test Photo 1');
    expect(responseData[0]).toHaveProperty('date', '01/01/2023');
    expect(responseData[0]).toHaveProperty('location', 'Test Location 1');
  });
  
  it('should handle errors during fetch', async () => {
    // Mock cloudinary to throw an error
    (cloudinary.search.execute as jest.Mock).mockRejectedValueOnce(
      new Error('Cloudinary API error')
    );
    
    const response = await GET();
    
    // Verify error response
    expect(response).toBeDefined();
    
    const responseData = await response.json();
    expect(responseData).toHaveProperty('error', 'Failed to fetch photos');
  });
}); 