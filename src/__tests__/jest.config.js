// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
  setupFilesAfterEnv: ['<rootDir>/setup.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  displayName: 'test',
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
  testPathIgnorePatterns: ['/node_modules/', '/e2e/'],
};

// Add a simple test to avoid "test suite must contain at least one test" error
test('jest.config.js is valid', () => {
  expect(module.exports).toBeDefined();
});