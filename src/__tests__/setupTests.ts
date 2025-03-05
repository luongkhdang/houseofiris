/**
 * QUALITY CHECK:
 * Strengths:
 * - Comprehensive setup for Jest testing environment
 * - Thorough mocking of browser APIs (fetch, Response, IntersectionObserver)
 * - Good organization with clear sections for different mock types
 * - Proper polyfills for Node.js environment
 * - Strategic suppression of known console errors during testing
 * - Mocking of third-party libraries like EmailJS
 * - Setup of environment variables for testing
 * 
 * Recommendations:
 * - Add JSDoc comments to document mock implementations and their purpose
 * - Consider extracting complex mocks to separate files for better organization
 * - Add typing for all mock interfaces and implementations
 * - Implement more complete mocks for NextResponse with all methods
 * - Consider using TypeScript namespaces for organizing related mocks
 * - Add comments explaining why certain console errors are suppressed
 * - Consider using a library like msw for API mocking instead of manual mocks
 */

// src/__tests__/setupTests.ts
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// Add a simple test to avoid the "test suite must contain at least one test" error
test('setupTests is loaded', () => {
  expect(true).toBe(true);
});

// Mock the global fetch API
global.fetch = jest.fn();

// Ensure timer functions are properly mocked
global.setInterval = jest.fn(() => {
  return 123; // Mock interval ID
}) as unknown as typeof setInterval;

global.clearInterval = jest.fn(() => {
  // Mock implementation
}) as unknown as typeof clearInterval;

// Custom mock interfaces
interface MockResponse {
  status: number;
  body: string;
  headers: Headers;
  json(): Promise<string>;
}

interface MockRequest {
  url: string;
  options: { body?: string };
  json(): Promise<Record<string, unknown>>;
}

// Mock Response constructor
global.Response = class implements MockResponse {
  status: number;
  body: string;
  headers: Headers;
  constructor(body?: string, options?: { status?: number; headers?: HeadersInit }) {
    this.status = options?.status || 200;
    this.body = body || "";
    this.headers = new Headers(options?.headers);
  }
  json() {
    return Promise.resolve(this.body);
  }
} as unknown as typeof Response;

// Mocking Next.js server-side objects
global.Request = class implements MockRequest {
  url: string;
  options: { body?: string };
  
  constructor(url: string, options?: { body?: string }) {
    this.url = url;
    this.options = options || {};
  }
  
  json() {
    return Promise.resolve(this.options?.body ? JSON.parse(this.options.body) : {});
  }
} as unknown as typeof Request;

// Mock next/server - NextResponse
jest.mock('next/server', () => {
  return {
    NextResponse: {
      json: jest.fn((data, options) => {
        return {
          status: options?.status || 200,
          headers: new Headers(),
          json: () => Promise.resolve(data)
        };
      })
    }
  };
});

// Polyfill TextEncoder/TextDecoder for node environment
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as unknown as typeof TextDecoder;

// Mock window.matchMedia for responsive design tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock Intersection Observer
interface MockIntersectionObserver {
  observe: jest.Mock;
  unobserve: jest.Mock;
  disconnect: jest.Mock;
  callback: IntersectionObserverCallback;
}

class IntersectionObserverMock implements MockIntersectionObserver {
  callback: IntersectionObserverCallback;
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
  
  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
  }
}

global.IntersectionObserver = IntersectionObserverMock as unknown as typeof IntersectionObserver;

// Suppress console errors during tests
const originalConsoleError = console.error;
console.error = (...args) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('Warning: ReactDOM.render is no longer supported') ||
     args[0].includes('Error: Not implemented: window.alert') ||
     args[0].includes('EmailJS configuration is missing') ||
     args[0].includes('Response.json is not a function') ||
     args[0].includes('TypeError: Response.json is not a function'))
  ) {
    return;
  }
  originalConsoleError(...args);
};

// Mock window.alert
window.alert = jest.fn();

// Mock EmailJS
jest.mock('@emailjs/browser', () => ({
  init: jest.fn(),
  send: jest.fn().mockResolvedValue({ status: 200, text: 'OK' })
}));

// Set environment variables for EmailJS
process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID = 'test-service-id';
process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID = 'test-template-id';
process.env.NEXT_PUBLIC_EMAILJS_USER_ID = 'test-user-id';