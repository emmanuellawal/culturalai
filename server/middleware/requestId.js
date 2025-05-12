/**
 * Request ID middleware
 * Assigns a unique identifier to each request for tracking through logs
 */

const { v4: uuidv4 } = require('uuid');

// Middleware to add a unique request ID to each request
const requestIdMiddleware = (req, res, next) => {
  // Use existing request ID from headers if present, otherwise generate a new one
  const requestId = req.headers['x-request-id'] || `req-${uuidv4()}`;
  
  // Add the request ID to the request object for use in application code
  req.requestId = requestId;
  
  // Add the request ID to response headers
  res.setHeader('X-Request-ID', requestId);
  
  next();
};

module.exports = requestIdMiddleware; 