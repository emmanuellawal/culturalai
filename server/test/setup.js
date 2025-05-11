// Test setup for server tests
const { before, after } = require('mocha');

// Mock global values and configurations for testing
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret';
process.env.PORT = '3001';

// Place to set up any global test resources
before(async function() {
  // Setup code to run before any tests
  console.log('Setting up test environment...');
});

// Place to clean up any global test resources
after(async function() {
  // Cleanup code to run after all tests
  console.log('Cleaning up test environment...');
}); 