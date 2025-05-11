import { SignUpCredentials, LoginCredentials, User } from '../types/user';
import { executeQuery } from '../utils/database';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

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
  
  try {
    // Check if email already exists
    const existingUsers = await executeQuery<{ count: number }>(
      'SELECT COUNT(*) as count FROM Users WHERE Email = @email',
      { email: credentials.email }
    );
    
    if (existingUsers[0].count > 0) {
      throw new Error('Email already exists');
    }
    
    // Generate new user ID
    const userId = `user-${uuidv4()}`;
    
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(credentials.password, salt);
    
    // Insert the new user
    await executeQuery(
      `INSERT INTO Users (UserID, Email, HashedPassword, CreatedAt, IsActive, IsVerified) 
       VALUES (@userId, @email, @hashedPassword, GETDATE(), 1, 0)`,
      {
        userId,
        email: credentials.email,
        hashedPassword
      }
    );
    
    // Return the created user (without password)
    return {
      id: userId,
      email: credentials.email,
      createdAt: new Date().toISOString()
    };
  } catch (error) {
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
    // Find user by email
    const users = await executeQuery<User & { HashedPassword: string }>(
      `SELECT UserID as id, Email as email, HashedPassword, CreatedAt as createdAt
       FROM Users WHERE Email = @email AND IsActive = 1`,
      { email: credentials.email }
    );
    
    if (users.length === 0) {
      throw new Error('Invalid credentials');
    }
    
    const user = users[0];
    
    // Verify password
    const isMatch = await bcrypt.compare(credentials.password, user.HashedPassword);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }
    
    // Update LastLogin
    await executeQuery(
      'UPDATE Users SET LastLogin = GETDATE() WHERE UserID = @userId',
      { userId: user.id }
    );
    
    // Return the user without password
    const { HashedPassword, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  // No database operation required for logout in this implementation
  // Client-side token will be removed
  return Promise.resolve();
}; 