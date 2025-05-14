import { SignUpCredentials, LoginCredentials, User } from '../types/user';
import axios from 'axios';
import { API_BASE_URL } from '../utils/config';

// Store token in memory for session duration
let authToken: string | null = null;

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
  
  try {
    const response = await axios.post(`${API_BASE_URL}/api/auth/signup`, {
      email: credentials.email,
      password: credentials.password,
      confirmPassword: credentials.confirmPassword
    });
    
    // Store the token
    authToken = response.data.token;
    
    // Return the created user
    return response.data.user;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      // Server returned an error response
      throw new Error(error.response.data.error || 'Failed to sign up');
    }
    console.error('Error during sign up:', error);
    throw error;
  }
};

export const login = async (credentials: LoginCredentials): Promise<User> => {
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(credentials.email)) {
    throw new Error('Invalid email format');
  }
  
  try {
    const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
      email: credentials.email,
      password: credentials.password
    });
    
    // Store the token
    authToken = response.data.token;
    
    // Return the user
    return response.data.user;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      // Server returned an error response
      throw new Error(error.response.data.error || 'Invalid credentials');
    }
    console.error('Error during login:', error);
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  // Clear the token
  authToken = null;
  return Promise.resolve();
};

// Get the current auth token
export const getToken = (): string | null => {
  return authToken;
}; 