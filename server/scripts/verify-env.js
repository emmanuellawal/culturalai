/**
 * Environment Variable Verification Script
 * 
 * This script checks if all required environment variables are set.
 * Run with: node verify-env.js
 */

const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const logger = require('../utils/logger');

// Load environment variables
dotenv.config();

// Try to load from database.env if available
const dbEnvPath = path.resolve(__dirname, '../../database.env');
if (fs.existsSync(dbEnvPath)) {
  dotenv.config({ path: dbEnvPath });
  logger.info('Loaded database.env configuration');
} else {
  logger.warn('database.env file not found');
}

// Required environment variables
const requiredVars = [
  // Database
  { name: 'DB_SERVER', alternatives: ['DB_CONNECTION_STRING'], isDbVar: true },
  { name: 'DB_NAME', alternatives: ['DB_CONNECTION_STRING'], isDbVar: true },
  
  // For username/password auth (not needed for Windows Auth)
  // { name: 'DB_USER', alternatives: ['DB_CONNECTION_STRING'], isDbVar: true, optional: true },
  // { name: 'DB_PASSWORD', alternatives: ['DB_CONNECTION_STRING'], isDbVar: true, optional: true },
  
  // Authentication
  { name: 'JWT_SECRET', isSecure: true },
  
  // OpenAI
  { name: 'OPENAI_API_KEY', alternatives: ['AI_SERVICE_API_KEY'], isSecure: true },
  
  // Admin access
  { name: 'ADMIN_TOKEN', isSecure: true },
  
  // Server configuration
  { name: 'PORT', defaultValue: '3000' }
];

console.log('\n=== Environment Variable Verification ===\n');

let missingRequired = 0;
let insecureWarnings = 0;

// Check each required variable
requiredVars.forEach(({ name, alternatives = [], isSecure = false, isDbVar = false, optional = false, defaultValue = null }) => {
  let value = process.env[name];
  let source = 'environment';
  let status = '✅ Set';
  
  // Check alternatives if the main variable is not set
  if (!value && alternatives.length > 0) {
    for (const alt of alternatives) {
      if (process.env[alt]) {
        value = `Using alternative: ${alt}`;
        source = 'alternative';
        break;
      }
    }
  }
  
  // Check default value if still not set
  if (!value && defaultValue) {
    value = `Using default: ${defaultValue}`;
    source = 'default';
  }
  
  // If still not set and not optional, flag as missing
  if (!value && !optional) {
    status = '❌ MISSING';
    missingRequired++;
  } else if (!value && optional) {
    status = '⚠️ Not set (optional)';
  }
  
  // Check if secure variables are using development defaults
  if (isSecure && value && 
     (value.includes('development') || 
      value.includes('default') || 
      value === 'your-secret-key-for-development')) {
    status = '⚠️ Using insecure default value';
    insecureWarnings++;
  }
  
  // Format output
  let displayValue = value;
  if (isSecure && value && source !== 'alternative') {
    // Mask secure values
    displayValue = value.substring(0, 3) + '...' + value.substring(value.length - 3);
  }
  
  console.log(`${name.padEnd(20)} | ${status.padEnd(20)} | ${displayValue || 'Not set'}`);
});

console.log('\n=== Summary ===');
if (missingRequired > 0) {
  console.log(`❌ Missing ${missingRequired} required environment variables`);
  console.log('   Please set these variables in your environment or .env file');
} else {
  console.log('✅ All required environment variables are set');
}

if (insecureWarnings > 0) {
  console.log(`⚠️ ${insecureWarnings} security warnings detected`);
  console.log('   Some secure variables are using development/default values');
  console.log('   Recommended to set proper values for production environments');
}

// Report on database.env file status
if (fs.existsSync(dbEnvPath)) {
  const gitignorePath = path.resolve(__dirname, '../../.gitignore');
  if (fs.existsSync(gitignorePath)) {
    const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
    if (gitignoreContent.includes('database.env')) {
      console.log('✅ database.env is correctly listed in .gitignore');
    } else {
      console.log('⚠️ WARNING: database.env is NOT listed in .gitignore');
      console.log('   This may expose database credentials in version control');
    }
  }
} 

console.log('\nVerification complete.'); 