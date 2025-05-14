const sql = require('mssql');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const logger = require('./logger');

// Load environment variables from database.env at the project root
const dbEnvPath = path.resolve(__dirname, '../../database.env');
if (fs.existsSync(dbEnvPath)) {
  logger.info('Loading database configuration from database.env');
  dotenv.config({ path: dbEnvPath });
}

// Database connection pool
let pool = null;

/**
 * Initialize the database connection pool
 */
async function initializePool() {
  try {
    if (pool) {
      logger.info('Database pool already exists, closing before reinitializing');
      await pool.close();
    }

    // Use connection string if available, otherwise build from components
    const config = process.env.DB_CONNECTION_STRING 
      ? { connectionString: process.env.DB_CONNECTION_STRING }
      : {
          server: process.env.DB_SERVER || 'localhost',
          database: process.env.DB_NAME || 'CulturalAI',
          // Using Windows Authentication
          options: {
            trustedConnection: true,
            trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true' || true,
            encrypt: false
          }
        };

    logger.info('Initializing database connection pool');
    pool = await sql.connect(config);
    logger.info('Database connection pool initialized successfully');
    
    return pool;
  } catch (error) {
    logger.error('Failed to initialize database connection pool', { 
      error: error.message,
      stack: error.stack
    });
    throw error;
  }
}

/**
 * Get the database connection pool, initializing if necessary
 */
async function getPool() {
  if (!pool) {
    return await initializePool();
  }
  return pool;
}

/**
 * Execute a database query
 * @param {string} query - SQL query string
 * @param {Object} params - Query parameters
 */
async function executeQuery(query, params = {}) {
  try {
    const dbPool = await getPool();
    const request = dbPool.request();

    // Add parameters to the request
    Object.entries(params).forEach(([key, value]) => {
      request.input(key, value);
    });

    const result = await request.query(query);
    return result;
  } catch (error) {
    logger.error('Database query error', { 
      error: error.message,
      query: query,
      params: JSON.stringify(params),
      stack: error.stack
    });
    throw error;
  }
}

module.exports = {
  initializePool,
  getPool,
  executeQuery
}; 