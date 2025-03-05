module.exports = 'test-file-stub';

// Add a simple test to avoid the "test suite must contain at least one test" error
test('file mock works', () => {
  expect(module.exports).toBe('test-file-stub');
}); 