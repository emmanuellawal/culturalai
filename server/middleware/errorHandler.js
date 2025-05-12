/**
 * Error handling middleware for the Cultural AI Navigator backend
 * Catches and logs errors, then sends appropriate responses
 */

const logger = require('../utils/logger');

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  // Log the error with context
  logger.error(`${err.name}: ${err.message}`, {
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
    userId: req.user?.id || 'unauthenticated',
    requestId: req.headers['x-request-id'] || `req-${Date.now()}`,
  });

  // Default error status and message
  let statusCode = err.statusCode || 500;
  let errorMessage = err.message || 'Internal Server Error';
  let errorDetails = undefined;

  // In development mode, include error details
  if (process.env.NODE_ENV === 'development') {
    errorDetails = {
      stack: err.stack?.split('\n'),
      code: err.code,
    };
  }

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
  } else if (err.name === 'UnauthorizedError' || err.name === 'JsonWebTokenError') {
    statusCode = 401;
  } else if (err.name === 'ForbiddenError') {
    statusCode = 403;
  } else if (err.name === 'NotFoundError') {
    statusCode = 404;
  }

  // Send response
  res.status(statusCode).json({
    error: {
      message: errorMessage,
      ...(errorDetails && { details: errorDetails }),
    },
  });
};

// Not Found handler (404)
const notFoundHandler = (req, res, next) => {
  logger.warn(`Route not found: ${req.method} ${req.path}`, {
    ip: req.ip,
    headers: req.headers,
    query: req.query,
  });

  res.status(404).json({
    error: {
      message: `Not Found: ${req.method} ${req.path}`,
    },
  });
};

// Custom error classes
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
  }
}

class UnauthorizedError extends Error {
  constructor(message = 'Unauthorized: Authentication required') {
    super(message);
    this.name = 'UnauthorizedError';
    this.statusCode = 401;
  }
}

class ForbiddenError extends Error {
  constructor(message = 'Forbidden: Insufficient permissions') {
    super(message);
    this.name = 'ForbiddenError';
    this.statusCode = 403;
  }
}

class NotFoundError extends Error {
  constructor(message = 'Resource not found') {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

module.exports = {
  errorHandler,
  notFoundHandler,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
}; 