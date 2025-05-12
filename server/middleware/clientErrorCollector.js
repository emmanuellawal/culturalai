/**
 * Client Error Collector Middleware
 * Endpoint to collect and log client-side errors
 */

const logger = require('../utils/logger');

// Middleware to handle client error reports
const clientErrorCollector = (req, res) => {
  try {
    const { 
      message, 
      source, 
      lineno, 
      colno, 
      error, 
      stack, 
      componentStack,
      url,
      userAgent,
      timestamp 
    } = req.body;

    // Log the client error with context
    logger.error(`Client Error: ${message || 'Unknown error'}`, {
      clientError: true,
      source,
      location: { lineno, colno },
      errorObject: error,
      stack: stack || componentStack,
      url,
      userAgent: userAgent || req.headers['user-agent'],
      timestamp: timestamp || new Date().toISOString(),
      ip: req.ip,
      requestId: req.requestId || req.headers['x-request-id'],
      userId: req.user?.id || 'unauthenticated',
    });

    // Send success response
    res.status(200).json({ success: true, message: 'Error logged successfully' });
  } catch (err) {
    // Log if there's an error processing the client error
    logger.error('Error processing client error report', { 
      error: err.message,
      stack: err.stack,
      requestBody: req.body 
    });
    
    // Still return a success to the client
    res.status(200).json({ success: true, message: 'Error received but not processed correctly' });
  }
};

module.exports = clientErrorCollector; 