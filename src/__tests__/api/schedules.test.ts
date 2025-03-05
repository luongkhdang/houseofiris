import { GET, POST, DELETE } from '../../app/api/schedules/route';

// Mock Redis
jest.mock('ioredis', () => {
  const mockRedis = {
    get: jest.fn().mockResolvedValue(JSON.stringify([
      { date: '2099-01-01', note: 'Test note 1' },
      { date: '2099-01-02', note: 'Test note 2' }
    ])),
    set: jest.fn().mockResolvedValue('OK')
  };
  
  return jest.fn(() => mockRedis);
});

// Mock current date to ensure consistent test results
const MOCK_DATE = new Date('2023-01-01');
const originalDate = global.Date;

describe('Schedules API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock the current date in a way that works with TypeScript
    global.Date = class extends originalDate {
      constructor() {
        super();
        return new originalDate(MOCK_DATE);
      }
    } as unknown as typeof Date;
  });
  
  afterEach(() => {
    // Restore original Date
    global.Date = originalDate;
  });

  it('should return schedules on GET', async () => {
    const response = await GET();
    
    // Verify response
    expect(response).toBeDefined();
    
    // Extract the JSON from the response
    const schedules = await response.json();
    
    // Check the structure of the response
    expect(Array.isArray(schedules)).toBe(true);
    expect(schedules.length).toBe(2);
    expect(schedules[0]).toHaveProperty('date', '2099-01-01');
    expect(schedules[0]).toHaveProperty('note', 'Test note 1');
    expect(schedules[1]).toHaveProperty('date', '2099-01-02');
    expect(schedules[1]).toHaveProperty('note', 'Test note 2');
  });
  
  it('should save schedule on POST', async () => {
    // Create a mock request with a future date
    const request = new Request('http://localhost/api/schedules', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        date: '2099-01-03',
        note: 'New schedule note'
      })
    });
    
    const response = await POST(request);
    
    // Verify response
    expect(response).toBeDefined();
    
    // Extract the JSON from the response
    const responseData = await response.json();
    
    // Check the structure of the response
    expect(responseData).toHaveProperty('message', 'Schedule saved successfully');
  });
  
  it('should delete schedule on DELETE', async () => {
    // Create a mock request
    const request = new Request('http://localhost/api/schedules?date=2099-01-01', {
      method: 'DELETE'
    });
    
    const response = await DELETE(request);
    
    // Verify response
    expect(response).toBeDefined();
    
    // Extract the JSON from the response
    const responseData = await response.json();
    
    // Check the structure of the response
    expect(responseData).toHaveProperty('message', 'Schedule deleted successfully');
  });
}); 