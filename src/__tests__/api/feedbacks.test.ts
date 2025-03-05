import { GET, POST } from '../../app/api/feedbacks/route';

// Mock Redis
jest.mock('ioredis', () => {
  const mockRedis = {
    get: jest.fn().mockResolvedValue(JSON.stringify([
      { date: '2023-01-01T12:00:00Z', content: 'Test feedback 1', replies: 'Test reply 1' },
      { date: '2023-01-02T12:00:00Z', content: 'Test feedback 2', replies: 'Test reply 2' }
    ])),
    set: jest.fn().mockResolvedValue('OK')
  };
  
  return jest.fn(() => mockRedis);
});

describe('Feedbacks API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return feedbacks on GET', async () => {
    const response = await GET();
    
    // Verify response
    expect(response).toBeDefined();
    
    // Extract the JSON from the response
    const feedbacks = await response.json();
    
    // Check the structure of the response
    expect(Array.isArray(feedbacks)).toBe(true);
    expect(feedbacks.length).toBe(2);
    
    // Update these assertions to be order-independent
    // The API may return the feedbacks in a different order than in our mock data
    expect(feedbacks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ content: 'Test feedback 1', replies: 'Test reply 1' }),
        expect.objectContaining({ content: 'Test feedback 2', replies: 'Test reply 2' })
      ])
    );
  });
  
  it('should save feedback on POST', async () => {
    // Create a mock request
    const request = new Request('http://localhost/api/feedbacks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        date: '2023-01-03T12:00:00Z',
        content: 'New feedback'
      })
    });
    
    const response = await POST(request);
    
    // Verify response
    expect(response).toBeDefined();
    
    // Extract the JSON from the response
    const responseData = await response.json();
    
    // Check the structure of the response
    expect(responseData).toHaveProperty('message', 'Feedback saved successfully');
  });
}); 