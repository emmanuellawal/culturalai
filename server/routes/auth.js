/**
 * Authentication API Routes
 */

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { executeQuery } = require('../utils/database');
const logger = require('../utils/logger');
const { v4: uuidv4 } = require('uuid');

// Get JWT secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-for-development';

/**
 * POST /api/auth/signup
 * Create a new user account
 */
router.post('/signup', async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;
    
    // Validate required fields
    if (!email || !password || !confirmPassword) {
      return res.status(400).json({ error: 'Email, password, and password confirmation are required' });
    }
    
    // Validate password match
    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    
    // Validate password (min length, complexity)
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }
    
    // Check if email already exists
    const existingUsers = await executeQuery(
      'SELECT COUNT(*) as count FROM Users WHERE Email = @email',
      { email }
    );
    
    if (existingUsers.recordset[0].count > 0) {
      return res.status(409).json({ error: 'Email already exists' });
    }
    
    // Generate new user ID
    const userId = `user-${uuidv4()}`;
    
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Insert the new user
    await executeQuery(
      `INSERT INTO Users (UserID, Email, HashedPassword, CreatedAt, IsActive, IsVerified) 
       VALUES (@userId, @email, @hashedPassword, GETDATE(), 1, 0)`,
      {
        userId,
        email,
        hashedPassword
      }
    );
    
    // Generate JWT token
    const token = jwt.sign(
      { id: userId, email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    // Return user info and token (without password)
    res.status(201).json({
      user: {
        id: userId,
        email,
        createdAt: new Date().toISOString()
      },
      token
    });
  } catch (error) {
    logger.error('Signup error', { error: error.message, stack: error.stack });
    res.status(500).json({ error: 'Failed to create user account' });
  }
});

/**
 * POST /api/auth/login
 * Authenticate a user
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    
    // Find user by email
    const result = await executeQuery(
      `SELECT UserID, Email, HashedPassword, CreatedAt
       FROM Users WHERE Email = @email AND IsActive = 1`,
      { email }
    );
    
    const users = result.recordset;
    
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const user = users[0];
    
    // Verify password
    const isMatch = await bcrypt.compare(password, user.HashedPassword);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Update LastLogin
    await executeQuery(
      'UPDATE Users SET LastLogin = GETDATE() WHERE UserID = @userId',
      { userId: user.UserID }
    );
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user.UserID, email: user.Email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    // Return user info and token (without password)
    res.json({
      user: {
        id: user.UserID,
        email: user.Email,
        createdAt: user.CreatedAt
      },
      token
    });
  } catch (error) {
    logger.error('Login error', { error: error.message, stack: error.stack });
    res.status(500).json({ error: 'Failed to authenticate user' });
  }
});

module.exports = router; 