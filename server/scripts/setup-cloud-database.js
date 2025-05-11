/**
 * Cloud Database Setup Script
 * 
 * This script can be used to set up the database schema in a cloud environment.
 * It reads the SQL file and executes it against the configured database.
 */

const fs = require('fs');
const path = require('path');
const sql = require('mssql');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Check for required environment variables
const requiredEnvVars = ['DB_CONNECTION_STRING', 'DB_SERVER', 'DB_USER', 'DB_PASSWORD'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars.join(', '));
  console.error('Please set these environment variables and try again.');
  process.exit(1);
}

// Read the SQL file
const sqlFilePath = path.resolve(__dirname, '../../create_database.sql');
const sqlScript = fs.readFileSync(sqlFilePath, 'utf8');

// Split the SQL script into individual statements
const statements = sqlScript
  .replace(/(\r\n|\n|\r)/gm, ' ') // Replace newlines with spaces
  .replace(/\/\*.*?\*\//g, '') // Remove comments
  .split(';') // Split on semicolon
  .map(statement => statement.trim())
  .filter(statement => statement.length > 0); // Remove empty statements

async function setupDatabase() {
  let pool;

  try {
    console.log('Connecting to database...');
    
    // Connect to the database
    if (process.env.DB_CONNECTION_STRING) {
      pool = await sql.connect(process.env.DB_CONNECTION_STRING);
    } else {
      // Use individual connection parameters if no connection string is provided
      pool = await sql.connect({
        server: process.env.DB_SERVER,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME || 'master',
        options: {
          trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true'
        }
      });
    }

    console.log('Connected to database.');

    // Check if the CulturalAI database already exists
    const dbExistsResult = await pool.request().query("SELECT COUNT(*) as count FROM sys.databases WHERE name = 'CulturalAI'");
    const dbExists = dbExistsResult.recordset[0].count > 0;

    if (dbExists) {
      console.log('CulturalAI database already exists.');
    } else {
      console.log('Creating CulturalAI database...');
      
      // Execute each statement
      for (const statement of statements) {
        if (statement.length > 0) {
          try {
            await pool.request().query(statement);
            console.log('Executed statement:', statement.substring(0, 50) + '...');
          } catch (err) {
            console.error('Error executing statement:', statement.substring(0, 100));
            console.error('Error details:', err.message);
            // Continue with the next statement
          }
        }
      }
      
      console.log('Database setup complete.');
    }

    // Verify if tables exist
    try {
      const result = await pool.request().query(`
        SELECT COUNT(*) as table_count 
        FROM CulturalAI.INFORMATION_SCHEMA.TABLES 
        WHERE TABLE_TYPE = 'BASE TABLE'
      `);
      
      console.log(`Number of tables in CulturalAI database: ${result.recordset[0].table_count}`);
    } catch (err) {
      console.error('Error checking tables:', err.message);
    }

  } catch (err) {
    console.error('Database setup error:', err.message);
    process.exit(1);
  } finally {
    if (pool) {
      await pool.close();
      console.log('Database connection closed.');
    }
  }
}

setupDatabase().catch(err => {
  console.error('Unhandled error:', err);
  process.exit(1);
}); 