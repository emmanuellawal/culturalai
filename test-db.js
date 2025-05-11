const sql = require('mssql');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load environment variables from database.env
const dbEnvPath = path.resolve(__dirname, 'database.env');
if (fs.existsSync(dbEnvPath)) {
  console.log('Loading environment variables from database.env');
  dotenv.config({ path: dbEnvPath });
}

// Try multiple connection methods
async function testConnection() {
  // Try connection string first (if defined)
  if (process.env.DB_CONNECTION_STRING) {
    let pool;
    try {
      console.log('Attempt 1: Testing connection with connection string...');
      
      // Mask sensitive info in logs
      const connectionString = process.env.DB_CONNECTION_STRING;
      const maskedString = connectionString.replace(/Password=[^;]+/i, 'Password=*****');
      console.log('Connection string (masked):', maskedString);
      
      pool = await sql.connect(process.env.DB_CONNECTION_STRING);
      await runTests(pool);
      return;
    } catch (error) {
      console.error('Connection string attempt failed:', error.message);
    } finally {
      if (pool) {
        try {
          await pool.close();
        } catch (err) {
          // Ignore close error
        }
      }
    }
  }
  
  // Try Windows Authentication
  const configWindowsAuth = {
    server: process.env.DB_SERVER || 'localhost',
    database: process.env.DB_NAME || 'master',
    options: {
      trustedConnection: true,
      trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true',
      encrypt: false
    }
  };
  
  let pool;
  try {
    console.log('\nAttempt 2: Testing with Windows Authentication...');
    console.log('Config:', {
      server: configWindowsAuth.server,
      database: configWindowsAuth.database,
      authentication: 'Windows Authentication'
    });
    
    pool = await sql.connect(configWindowsAuth);
    await runTests(pool);
    return;
  } catch (error) {
    console.error('Windows Authentication failed:', error.message);
  } finally {
    if (pool) {
      try {
        await pool.close();
      } catch (err) {
        // Ignore close error
      }
    }
  }
  
  // If we're still here, try one more approach: connecting to localhost
  const configLocalhost = {
    server: 'localhost',
    database: process.env.DB_NAME || 'master',
    user: process.env.DB_USER || 'sa',
    password: process.env.DB_PASSWORD || '',
    options: {
      trustServerCertificate: true,
      encrypt: false
    }
  };
  
  try {
    console.log('\nAttempt 3: Testing direct localhost connection...');
    console.log('Config:', {
      server: 'localhost',
      database: configLocalhost.database,
      user: configLocalhost.user
    });
    
    pool = await sql.connect(configLocalhost);
    await runTests(pool);
    return;
  } catch (error) {
    console.error('All connection attempts failed.');
    console.error('Last error:', error.message);
    
    console.log('\nTroubleshooting tips for SQL Server connection:');
    console.log('1. Enable SQL Server Authentication (Mixed Mode) in SQL Server Management Studio');
    console.log('2. Enable TCP/IP in SQL Server Configuration Manager');
    console.log('3. Make sure the SA account is enabled with a strong password');
    console.log('4. Configure SQL Server to allow remote connections');
    console.log('5. Open firewall for SQL Server port (usually 1433)');
    console.log('6. Check if SQL Server Browser service is running');
    console.log('7. Restart SQL Server after making these changes');
    console.log('\nTo use SQL Server from WSL2, try these commands in Windows PowerShell to check your SQL Server configuration:');
    console.log('  netstat -a | findstr 1433    (check if SQL Server is listening)');
    console.log('  Get-Service | findstr "SQL Server"   (check if SQL Server is running)');
  } finally {
    if (pool) {
      try {
        await pool.close();
        console.log('Database connection pool closed');
      } catch (err) {
        console.error('Error closing pool:', err.message);
      }
    }
  }
}

async function runTests(pool) {
  // Test query
  const result = await pool.request().query('SELECT @@VERSION as version');
  console.log('Database connection successful!');
  console.log('SQL Server version:', result.recordset[0].version);
  
  // Test if CulturalAI database exists
  try {
    const dbExists = await pool.request().query("SELECT COUNT(*) as count FROM sys.databases WHERE name = 'CulturalAI'");
    const dbCount = dbExists.recordset[0].count;
    
    if (dbCount > 0) {
      console.log('CulturalAI database exists!');
      
      // Check if we can access the Cultures table
      try {
        await pool.request().query("USE CulturalAI");
        const tableExists = await pool.request().query("SELECT COUNT(*) as count FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Cultures'");
        
        if (tableExists.recordset[0].count > 0) {
          console.log('Cultures table exists!');
          const cultures = await pool.request().query('SELECT COUNT(*) as count FROM Cultures');
          console.log('Number of cultures in database:', cultures.recordset[0].count);
        } else {
          console.log('Cultures table does not exist yet. You may need to run your create_database.sql script.');
        }
      } catch (err) {
        console.error('Error accessing CulturalAI tables:', err.message);
      }
    } else {
      console.log('CulturalAI database does not exist yet. You need to run your create_database.sql script.');
    }
  } catch (err) {
    console.error('Error checking database existence:', err.message);
  }
}

// Run the test
testConnection(); 