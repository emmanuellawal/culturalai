/**
 * Client Configuration Verification Script
 * 
 * This script checks if the client configuration is correctly set up,
 * particularly focusing on the API_BASE_URL.
 * 
 * Run with: node verify-client-config.js
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');

// List of config files to check
const configFiles = [
  {
    path: path.resolve(__dirname, '../utils/config.ts'),
    name: 'config.ts'
  },
  {
    path: path.resolve(__dirname, '../utils/constants.ts'),
    name: 'constants.ts'
  }
];

console.log('\n=== Client Configuration Verification ===\n');

// Function to extract API_BASE_URL from a file
function extractApiBaseUrl(fileContent) {
  // Check for the conditional export pattern with __DEV__
  const devRegex = /export\s+const\s+API_BASE_URL\s*=\s*__DEV__\s*\?\s*['"]([^'"]*)['"]/;
  const devMatch = fileContent.match(devRegex);
  
  if (devMatch) {
    console.log("  ℹ️ Found development API_BASE_URL");
    return devMatch[1]; // Return the development URL
  }
  
  // Check for direct export
  const directRegex = /export\s+const\s+API_BASE_URL\s*=\s*['"]([^'"]*)['"]/;
  const directMatch = fileContent.match(directRegex);
  
  if (directMatch) {
    return directMatch[1];
  }
  
  // Check for imports and re-exports
  const importRegex = /import\s*{\s*API_BASE_URL.*}\s*from\s*['"](.*)['"];/;
  const importMatch = fileContent.match(importRegex);
  
  if (importMatch) {
    console.log(`  ℹ️ API_BASE_URL is imported from: ${importMatch[1]}`);
    return "Imported - see other config file";
  }
  
  return null;
}

// Flag to track if we found an API_BASE_URL
let foundApiBaseUrl = false;
let apiBaseUrl = null;

// Check each config file
for (const configFile of configFiles) {
  if (fs.existsSync(configFile.path)) {
    console.log(`Reading ${configFile.name}...`);
    
    const fileContent = fs.readFileSync(configFile.path, 'utf8');
    const extractedUrl = extractApiBaseUrl(fileContent);
    
    if (extractedUrl) {
      console.log(`✅ Found API_BASE_URL in ${configFile.name}: ${extractedUrl}`);
      if (extractedUrl !== "Imported - see other config file") {
        apiBaseUrl = extractedUrl;
        foundApiBaseUrl = true;
      }
    } else {
      console.log(`❌ API_BASE_URL not found in ${configFile.name}`);
    }
  } else {
    console.log(`❌ File not found: ${configFile.name}`);
  }
}

if (!foundApiBaseUrl) {
  console.log('\n❌ API_BASE_URL not found in any config file. This needs to be fixed.');
  process.exit(1);
}

// Check if the URL is a development URL
if (apiBaseUrl.includes('localhost') || apiBaseUrl.includes('127.0.0.1')) {
  console.log('\n⚠️ Using local development URL. Make sure to update for production.');
}

// Try to test the connection to the API
console.log('\nTesting connection to API server...');

// Only test the API if there's a URL to test
if (apiBaseUrl) {
  // Add /health if the apiBaseUrl doesn't already include a path
  const testUrl = apiBaseUrl.includes('/api/') 
    ? apiBaseUrl.replace('/api/', '/api/health')
    : (apiBaseUrl.endsWith('/api') ? `${apiBaseUrl}/health` : apiBaseUrl);
  
  console.log(`Attempting to connect to: ${testUrl}`);
  
  axios.get(testUrl)
    .then(response => {
      console.log(`✅ Successfully connected to API at ${testUrl}`);
      console.log(`Response status: ${response.status}`);
      if (response.data) {
        console.log('Response data:', JSON.stringify(response.data, null, 2));
      }
    })
    .catch(error => {
      console.log(`❌ Failed to connect to API at ${testUrl}`);
      if (error.response) {
        console.log(`Response status: ${error.response.status}`);
        console.log('Response data:', JSON.stringify(error.response.data, null, 2));
      } else if (error.request) {
        console.log('No response received. API server might be down or URL is incorrect.');
      } else {
        console.log('Error:', error.message);
      }
      
      // If ECONNREFUSED, provide specific advice
      if (error.code === 'ECONNREFUSED') {
        console.log('\nIt appears the server is not running. Make sure to:');
        console.log('1. Start the server with "npm start" in the server directory');
        console.log('2. Verify the port matches the one in your API_BASE_URL');
        console.log(`3. Check if any firewall is blocking the connection to ${apiBaseUrl}`);
      }
    })
    .finally(() => {
      console.log('\nVerification complete.');
    });
} else {
  console.log('❌ Cannot test API connection without a valid API_BASE_URL');
  console.log('\nVerification complete.');
} 