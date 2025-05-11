import sql from 'mssql';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load environment variables from .env
dotenv.config();

// Try to load from database.env if available
const dbEnvPath = path.resolve(process.cwd(), 'database.env');
if (fs.existsSync(dbEnvPath)) {
  dotenv.config({ path: dbEnvPath });
}

// Database configuration
const config = {
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_NAME || 'CulturalAI',
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || '',
  options: {
    trustServerCertificate: true, // For development only; don't use in production
    enableArithAbort: true
  }
};

console.log('Database connection config:', {
  server: config.server,
  database: config.database,
  user: config.user,
  // Don't log password
});

// Create a connection pool
const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect();

// Handle connection errors
poolConnect.catch(err => {
  console.error('Database connection error:', err);
});

/**
 * Execute a SQL query with parameters
 * @param query The SQL query to execute
 * @param params Parameters for the query
 * @returns Promise with the query result
 */
export async function executeQuery<T>(query: string, params: any = {}): Promise<T[]> {
  try {
    // Wait for pool connection to initialize
    await poolConnect;
    
    // Create request and add parameters
    const request = pool.request();
    
    // Add parameters to the request
    Object.entries(params).forEach(([key, value]) => {
      request.input(key, value);
    });
    
    // Execute the query
    const result = await request.query(query);
    
    return result.recordset as T[];
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
}

/**
 * Execute a stored procedure with parameters
 * @param procedure The name of the stored procedure
 * @param params Parameters for the stored procedure
 * @returns Promise with the procedure result
 */
export async function executeStoredProcedure<T>(procedure: string, params: any = {}): Promise<T[]> {
  try {
    // Wait for pool connection to initialize
    await poolConnect;
    
    // Create request and add parameters
    const request = pool.request();
    
    // Add parameters to the request
    Object.entries(params).forEach(([key, value]) => {
      request.input(key, value);
    });
    
    // Execute the stored procedure
    const result = await request.execute(procedure);
    
    return result.recordset as T[];
  } catch (error) {
    console.error('Error executing stored procedure:', error);
    throw error;
  }
}

/**
 * Close the database connection pool
 */
export async function closePool(): Promise<void> {
  try {
    await pool.close();
    console.log('Database connection pool closed');
  } catch (error) {
    console.error('Error closing connection pool:', error);
    throw error;
  }
}

// Make sure to close the pool when your application shuts down
process.on('SIGINT', async () => {
  await closePool();
  process.exit(0);
});

export default {
  executeQuery,
  executeStoredProcedure,
  closePool
}; 