/**
 * Production environment configuration
 */

module.exports = {
  // Server Configuration
  server: {
    port: process.env.PORT || 3000,
    httpsPort: process.env.HTTPS_PORT || 3443,
    environment: 'production',
    enableHttps: process.env.ENABLE_HTTPS === 'true' || true,
    generateSelfSignedCerts: process.env.GENERATE_SELF_SIGNED_CERTS === 'true' || true
  },
  
  // Database Configuration
  // These will be overridden by environment variables in production
  database: {
    connectionString: process.env.DB_CONNECTION_STRING,
    server: process.env.DB_SERVER,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'CulturalAI',
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true' || true
  },
  
  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRATION || '24h' 
  },
  
  // Logging Configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    enableRequestLogging: process.env.ENABLE_REQUEST_LOGGING === 'true' || true
  },
  
  // CORS Configuration
  cors: {
    allowedOrigins: process.env.CORS_ALLOWED_ORIGINS ? process.env.CORS_ALLOWED_ORIGINS.split(',') : ['*']
  },
  
  // AI Service Configuration
  ai: {
    apiKey: process.env.AI_SERVICE_API_KEY,
    endpoint: process.env.AI_SERVICE_ENDPOINT
  }
}; 