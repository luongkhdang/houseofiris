import { GET } from '../../app/api/sticker-list/route';

// Mock the fs and path modules
jest.mock('fs', () => ({
  promises: {
    readdir: jest.fn().mockResolvedValue(['sticker1.png', 'sticker2.png']),
    stat: jest.fn().mockResolvedValue({
      isFile: () => true,
      size: 1024
    })
  }
}));

jest.mock('path', () => ({
  join: jest.fn().mockReturnValue('/mocked/path/to/stickers'),
  resolve: jest.fn().mockReturnValue('/mocked/path/to/stickers'),
  basename: jest.fn((filePath) => filePath.split('/').pop())
}));

describe('Sticker List API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a list of stickers on GET', async () => {
    const response = await GET();
    
    // Verify response
    expect(response).toBeDefined();
    
    // Extract the JSON from the response
    const stickers = await response.json();
    
    // Check the structure of the response
    expect(Array.isArray(stickers)).toBe(true);
    expect(stickers.length).toBe(2);
    expect(stickers).toContain('sticker1.png');
    expect(stickers).toContain('sticker2.png');
  });
}); 