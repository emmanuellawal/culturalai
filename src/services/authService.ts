import { SignUpCredentials, LoginCredentials, User } from '../types/user';

// For demo purposes, we'll use a mock API
// In a real application, these would call actual API endpoints
const BASE_URL = 'https://api.example.com'; // Replace with actual API URL when available

export const signUp = async (credentials: SignUpCredentials): Promise<User> => {
  // Validate password match
  if (credentials.password !== credentials.confirmPassword) {
    throw new Error('Passwords do not match');
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(credentials.email)) {
    throw new Error('Invalid email format');
  }
  
  // Validate password (min length, complexity)
  if (credentials.password.length < 8) {
    throw new Error('Password must be at least 8 characters long');
  }
  
  // TODO: Replace with actual API call
  // For demo, we'll just simulate an API response
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate a successful response
      resolve({
        id: 'user-' + Math.random().toString(36).substr(2, 9),
        email: credentials.email,
        createdAt: new Date().toISOString()
      });
      
      // Uncomment to simulate an error
      // reject(new Error('Email already exists'));
    }, 1000);
  });
};

export const login = async (credentials: LoginCredentials): Promise<User> => {
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(credentials.email)) {
    throw new Error('Invalid email format');
  }
  
  // TODO: Replace with actual API call
  // For demo, we'll just simulate an API response
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate a successful response
      resolve({
        id: 'user-' + Math.random().toString(36).substr(2, 9),
        email: credentials.email,
        createdAt: new Date().toISOString()
      });
      
      // Uncomment to simulate an error
      // reject(new Error('Invalid credentials'));
    }, 1000);
  });
};

export const logout = async (): Promise<void> => {
  // TODO: Replace with actual API call if needed
  // For now, just return a resolved promise
  return Promise.resolve();
}; 