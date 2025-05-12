/**
 * HTTP Request Logging Middleware
 * Uses Morgan for HTTP request logging with custom format and winston logger integration
 */

const morgan = require('morgan');
const { httpLogStream } = require('../utils/logger');

// Define custom Morgan format for both machine parsing and human readability
const morganFormat = process.env.NODE_ENV === 'production'
  ? JSON.stringify({
      method: ':method',
      url: ':url',
      status: ':status',
      responseTime: ':response-time ms',
      contentLength: ':res[content-length]',
      referrer: ':referrer',
      userAgent: ':user-agent',
      ip: ':remote-addr',
      requestId: ':req[x-request-id]',
    })
  : ':method :url :status :response-time ms - :res[content-length] - :req[x-request-id]';

// Create the Morgan middleware with our custom format and logger stream
const requestLogger = morgan(morganFormat, {
  stream: httpLogStream,
  // Only log error responses in production
  skip: (req, res) => process.env.NODE_ENV === 'production' && res.statusCode < 400,
});

module.exports = requestLogger; 