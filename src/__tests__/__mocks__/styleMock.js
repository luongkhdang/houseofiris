module.exports = {};

// Add a simple test to avoid the "test suite must contain at least one test" error
test('style mock works', () => {
  expect(module.exports).toEqual({});
}); 