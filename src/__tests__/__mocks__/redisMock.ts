/**
 * Comprehensive Redis mock for testing
 * 
 * This unified mock provides a consistent way to mock Redis across all tests.
 * It includes common Redis operations and allows for easy customization in individual tests.
 */

// Define types for Redis values
interface RedisValue {
  [key: string]: string | number | boolean | null | RedisValue | RedisValue[];
}

// In-memory storage for Redis data
const redisData: Record<string, string> = {};

// Mock implementation that can be used across tests
const createRedisMock = (initialData: Record<string, RedisValue> = {}) => {
  // Initialize the mock data
  Object.entries(initialData).forEach(([key, value]) => {
    redisData[key] = JSON.stringify(value);
  });

  // Create the mock instance
  const mockRedis = {
    // Basic Redis commands
    get: jest.fn().mockImplementation((key: string) => {
      return Promise.resolve(redisData[key] || null);
    }),
    
    set: jest.fn().mockImplementation((key: string, value: string) => {
      redisData[key] = value;
      return Promise.resolve('OK');
    }),
    
    del: jest.fn().mockImplementation((key: string) => {
      if (redisData[key]) {
        delete redisData[key];
        return Promise.resolve(1);
      }
      return Promise.resolve(0);
    }),
    
    exists: jest.fn().mockImplementation((key: string) => {
      return Promise.resolve(redisData[key] ? 1 : 0);
    }),
    
    // List operations
    lpush: jest.fn().mockImplementation((key: string, ...values: string[]) => {
      if (!redisData[key]) {
        redisData[key] = JSON.stringify([]);
      }
      
      const list = JSON.parse(redisData[key]);
      const newList = [...values.reverse(), ...list];
      redisData[key] = JSON.stringify(newList);
      
      return Promise.resolve(newList.length);
    }),
    
    rpush: jest.fn().mockImplementation((key: string, ...values: string[]) => {
      if (!redisData[key]) {
        redisData[key] = JSON.stringify([]);
      }
      
      const list = JSON.parse(redisData[key]);
      const newList = [...list, ...values];
      redisData[key] = JSON.stringify(newList);
      
      return Promise.resolve(newList.length);
    }),
    
    lrange: jest.fn().mockImplementation((key: string, start: number, end: number) => {
      if (!redisData[key]) {
        return Promise.resolve([]);
      }
      
      const list = JSON.parse(redisData[key]);
      // Handle negative indices and infinity
      const normalizedEnd = end === -1 ? list.length - 1 : end;
      const result = list.slice(start, normalizedEnd + 1);
      
      return Promise.resolve(result);
    }),
    
    // Utility methods for testing
    flushAll: jest.fn().mockImplementation(() => {
      Object.keys(redisData).forEach((key) => {
        delete redisData[key];
      });
      return Promise.resolve('OK');
    }),
    
    // Connection methods
    quit: jest.fn().mockResolvedValue('OK'),
    disconnect: jest.fn().mockResolvedValue('OK')
  };

  return mockRedis;
};

// Mock constructor for ioredis
const RedisMock = jest.fn().mockImplementation((url?: string) => {
  // Log connection URL for debugging
  if (url) {
    console.log(`Redis mock connecting to: ${url}`);
  }
  return createRedisMock();
});

// Export the mock and helper functions
export default RedisMock;
export { createRedisMock, redisData };

// How to use this mock:
/*
// In your test file:
import RedisMock, { createRedisMock } from '../__mocks__/redisMock';

// Mock the ioredis module
jest.mock('ioredis', () => RedisMock);

// Optional: Initialize with data for specific tests
beforeEach(() => {
  const mockRedis = createRedisMock({
    'schedules': [
      { date: '2099-01-01', note: 'Test note 1' },
      { date: '2099-01-02', note: 'Test note 2' }
    ],
    'feedbacks': [
      { date: '2023-01-01', content: 'Test feedback 1' },
      { date: '2023-01-02', content: 'Test feedback 2' }
    ]
  });
  
  // Replace the current instance with our custom one
  RedisMock.mockImplementation(() => mockRedis);
});

// Reset mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});
*/ 