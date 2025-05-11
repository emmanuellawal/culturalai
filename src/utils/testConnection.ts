import { executeQuery, closePool } from './database';

async function testConnection() {
  try {
    console.log('Testing database connection...');
    
    // Try to query the database version
    const result = await executeQuery<{ version: string }>('SELECT @@VERSION as version');
    
    console.log('Connection successful!');
    console.log('SQL Server version:', result[0].version);
    
    // Test querying Cultures table
    const cultures = await executeQuery('SELECT COUNT(*) as count FROM Cultures');
    console.log('Number of cultures in the database:', cultures[0].count);
    
    await closePool();
  } catch (error) {
    console.error('Database connection test failed:', error);
  }
}

// Run the test
testConnection(); 