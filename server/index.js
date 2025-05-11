const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const fs = require('fs');
const http = require('http');
const https = require('https');
const path = require('path');
const helmet = require('helmet');
const morgan = require('morgan');

// Import our utilities
const { encrypt, decrypt, anonymizePII } = require('./utils/encryption');
const { privacyLogger, processTextForStorage } = require('./utils/dataRetention');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;
const HTTPS_PORT = process.env.HTTPS_PORT || 3443;

// Middleware for security
app.use(helmet()); // Adds various HTTP headers for security
app.use(morgan('combined')); // Logging
app.use(cors());
app.use(bodyParser.json());

// Middleware to redirect HTTP to HTTPS in production
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.secure) {
      // Request is already secure
      next();
    } else {
      // Redirect to HTTPS
      const httpsUrl = `https://${req.hostname}:${HTTPS_PORT}${req.url}`;
      res.redirect(httpsUrl);
    }
  });
}

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-for-development';

// Authentication middleware
const authenticate = async (req, res, next) => {
  try {
    // Get token from headers
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = await promisify(jwt.verify)(token, JWT_SECRET);
    
    // Add user data to request
    req.user = decoded;
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Text Analysis endpoint
app.post('/api/analysis/text', authenticate, (req, res) => {
  try {
    const { text, cultureId, textOrigin } = req.body;
    
    if (!text || !cultureId) {
      return res.status(400).json({ error: 'Text and culture ID are required' });
    }
    
    // In a real implementation, this would call an AI service
    // For now, we'll use a mock implementation
    
    // For MVP: Don't store any PII from text analysis
    // Log only minimal information for debugging using our privacy-aware logger
    privacyLogger('Analysis request received', {
      userId: req.user.id,
      cultureId,
      textOrigin,
      text // This will be handled properly by the privacy logger
    }, 'ANALYZED_TEXT');
    
    // Mock analysis that looks for specific patterns
    const mockAnalysis = {
      summary: `Analysis of text in relation to ${getFullCultureName(cultureId)} culture.`,
      issues: []
    };
    
    // Check for idioms (very simplified)
    if (text.toLowerCase().includes('break a leg') || text.toLowerCase().includes('piece of cake')) {
      mockAnalysis.issues.push({
        type: 'Idiom',
        text: text.toLowerCase().includes('break a leg') ? 'break a leg' : 'piece of cake',
        explanation: 'This English idiom may not translate well in other cultures and could be confusing.',
        suggestion: 'Consider using more direct language instead of idioms when communicating across cultures.',
        idiomId: 'idiom123' // In a real implementation, this would be a database ID
      });
    }
    
    // Check for formality issues (very simplified)
    if (text.toLowerCase().includes('hey') || text.toLowerCase().includes('whats up')) {
      mockAnalysis.issues.push({
        type: 'Formality',
        text: text.toLowerCase().includes('hey') ? 'hey' : 'whats up',
        explanation: 'This greeting is too casual for formal or initial business interactions in many cultures.',
        suggestion: 'Consider "Good morning/afternoon" or "Hello" for a more universally appropriate greeting.'
      });
    }
    
    // If analyzing someone else's text (interpretation aid)
    if (textOrigin === 'theirs' && text.length > 20) {
      mockAnalysis.issues.push({
        type: 'Context',
        text: '(General observation)',
        explanation: `When interpreting this message from a ${getFullCultureName(cultureId)} context, consider that communication may be more indirect. Look for subtle cues rather than explicit statements.`
      });
    }
    
    // If no specific issues found, add a general note
    if (mockAnalysis.issues.length === 0) {
      mockAnalysis.issues.push({
        type: 'General',
        text: '(No specific issues detected)',
        explanation: 'No obvious cultural concerns detected in the provided text. However, always consider context and relationship with the recipient.'
      });
    }
    
    // Add alternative phrasings if appropriate (for user's own text)
    if (textOrigin === 'mine' && text.length > 10) {
      mockAnalysis.alternatives = [
        'A more culturally adapted version might be: "' + text.replace(/hey/i, 'Hello').replace(/whats up/i, 'How are you') + '"',
        'For formal contexts: "' + text.replace(/break a leg/i, 'I wish you success').replace(/piece of cake/i, 'very straightforward') + '"'
      ];
    }
    
    // Implement data retention policy - don't store analyzed text
    // If we needed to store it temporarily, we would process it first
    const textToStore = processTextForStorage(text);
    // Since our policy is not to store, textToStore will be null
    
    res.json(mockAnalysis);
  } catch (error) {
    console.error('Text analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze text' });
  }
});

// Helper function to get full culture name
function getFullCultureName(cultureId) {
  const cultures = {
    'jp': 'Japanese',
    'de': 'German',
    'sa': 'Saudi Arabian',
    'us': 'American',
    'cn': 'Chinese',
    'fr': 'French',
    'br': 'Brazilian',
    'in': 'Indian'
  };
  
  return cultures[cultureId] || 'selected';
}

// Data deletion request endpoint (placeholder for manual fulfillment)
app.post('/api/user/data-deletion-request', authenticate, (req, res) => {
  try {
    // In a real implementation, this would create a data deletion request
    // For MVP, we'll just log it and return success
    privacyLogger('Data deletion request received', { userId: req.user.id }, 'USER_REQUEST');
    
    // Send confirmation email (placeholder)
    console.log(`Sending confirmation email for data deletion request to user`);
    
    res.json({ 
      success: true, 
      message: 'Your data deletion request has been received. We will process it within 30 days and send you a confirmation email.'
    });
  } catch (error) {
    console.error('Data deletion request error:', error);
    res.status(500).json({ error: 'Failed to process data deletion request' });
  }
});

// Data export request endpoint (placeholder for manual fulfillment)
app.post('/api/user/data-export-request', authenticate, (req, res) => {
  try {
    // In a real implementation, this would create a data export request
    // For MVP, we'll just log it and return success
    privacyLogger('Data export request received', { userId: req.user.id }, 'USER_REQUEST');
    
    // Send confirmation email (placeholder)
    console.log(`Sending confirmation email for data export request to user`);
    
    res.json({ 
      success: true, 
      message: 'Your data export request has been received. We will process it within 30 days and send you a confirmation email with your data.'
    });
  } catch (error) {
    console.error('Data export request error:', error);
    res.status(500).json({ error: 'Failed to process data export request' });
  }
});

// Feedback submission endpoint for reporting issues with AI analysis
app.post('/api/feedback', async (req, res) => {
  try {
    const { 
      analysisId, 
      analysisType, 
      cultureId, 
      feedbackType, 
      feedbackText,
      timestamp 
    } = req.body;
    
    // Basic validation
    if (!feedbackType || !feedbackText) {
      return res.status(400).json({ error: 'Feedback type and text are required' });
    }
    
    // Get user ID if authenticated
    let userId = 'anonymous';
    try {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        const decoded = await promisify(jwt.verify)(token, JWT_SECRET);
        userId = decoded.id;
      }
    } catch (error) {
      // Continue as anonymous if token is invalid
      console.log('Anonymous feedback submission');
    }
    
    // In a real implementation, this would store the feedback in a database
    // For MVP, we'll just log it
    privacyLogger('Feedback received', {
      userId,
      analysisId,
      analysisType,
      cultureId,
      feedbackType,
      feedbackText: anonymizePII(feedbackText), // Anonymize any PII in feedback
      timestamp
    }, 'FEEDBACK');
    
    // In a production environment, we might:
    // 1. Store the feedback in a database
    // 2. Send notifications to the team
    // 3. Create tickets in an issue tracking system
    
    res.json({
      success: true,
      message: 'Thank you for your feedback. We appreciate your help in improving our AI.'
    });
  } catch (error) {
    console.error('Feedback submission error:', error);
    res.status(500).json({ error: 'Failed to process feedback' });
  }
});

// Function to generate self-signed certificates for development
function generateSelfSignedCerts() {
  const certDir = path.join(__dirname, 'certs');
  const keyPath = path.join(certDir, 'privkey.pem');
  const certPath = path.join(certDir, 'fullchain.pem');
  
  // Check if certificates already exist
  if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
    console.log('SSL certificates already exist');
    return { key: fs.readFileSync(keyPath), cert: fs.readFileSync(certPath) };
  }
  
  console.log('Generating self-signed certificates for development...');
  
  // Ensure the certs directory exists
  if (!fs.existsSync(certDir)) {
    fs.mkdirSync(certDir, { recursive: true });
  }
  
  // In a real implementation, we would use a library like selfsigned or openssl
  // For MVP, we'll create placeholder files with instructions
  const keyContent = '-----BEGIN PRIVATE KEY-----\n' +
                    'Replace this with your actual private key\n' +
                    '-----END PRIVATE KEY-----';
  
  const certContent = '-----BEGIN CERTIFICATE-----\n' +
                     'Replace this with your actual certificate\n' +
                     '-----END CERTIFICATE-----';
  
  fs.writeFileSync(keyPath, keyContent);
  fs.writeFileSync(certPath, certContent);
  
  console.log('Created placeholder certificate files. Replace with actual certificates before production use.');
  
  return { key: keyContent, cert: certContent };
}

// Start the appropriate servers based on environment
if (process.env.NODE_ENV === 'production') {
  try {
    // In production, attempt to load SSL certificates
    const sslOptions = {
      key: fs.readFileSync(path.join(__dirname, 'certs', 'privkey.pem')),
      cert: fs.readFileSync(path.join(__dirname, 'certs', 'fullchain.pem')),
    };

    // Create HTTPS server
    https.createServer(sslOptions, app).listen(HTTPS_PORT, () => {
      console.log(`HTTPS Server running on port ${HTTPS_PORT}`);
    });

    // Create HTTP server only for redirecting to HTTPS
    http.createServer(app).listen(PORT, () => {
      console.log(`HTTP Server running on port ${PORT} (redirects to HTTPS)`);
    });
  } catch (error) {
    console.error('Failed to start HTTPS server, falling back to HTTP:', error);
    // Fallback to HTTP if SSL setup fails
    http.createServer(app).listen(PORT, () => {
      console.log(`HTTP Server running on port ${PORT}`);
    });
  }
} else {
  // In development, generate self-signed certificates
  try {
    const sslOptions = generateSelfSignedCerts();
    
    // Create HTTPS server
    https.createServer(sslOptions, app).listen(HTTPS_PORT, () => {
      console.log(`HTTPS Server running on port ${HTTPS_PORT} (development)`);
    });
    
    // Create HTTP server
    http.createServer(app).listen(PORT, () => {
      console.log(`HTTP Server running on port ${PORT} (development)`);
    });
  } catch (error) {
    console.error('Failed to start HTTPS server in development, falling back to HTTP:', error);
    // Fallback to HTTP
    http.createServer(app).listen(PORT, () => {
      console.log(`HTTP Server running on port ${PORT} (development)`);
    });
  }
} 