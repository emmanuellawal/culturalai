/**
 * Encryption utilities for securing sensitive data at rest
 */
const crypto = require('crypto');

// Encryption key and initialization vector should be stored securely
// In production, these should be in environment variables
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'a-32-character-string-for-aes256key'; // Must be 32 bytes for aes-256-gcm
const IV_LENGTH = 16; // For AES, this is always 16 bytes

/**
 * Encrypts text using AES-256-GCM
 * 
 * @param {string} text - The text to encrypt
 * @returns {string} - Encrypted text as hex string with IV prepended
 */
function encrypt(text) {
  if (!text) return null;
  
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(ENCRYPTION_KEY), iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  // Get the authentication tag
  const authTag = cipher.getAuthTag().toString('hex');
  
  // Return iv + authTag + encrypted data
  // Format: iv:authTag:encryptedData
  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

/**
 * Decrypts text using AES-256-GCM
 * 
 * @param {string} encryptedText - The text to decrypt (format: iv:authTag:encryptedData)
 * @returns {string} - Decrypted text
 */
function decrypt(encryptedText) {
  if (!encryptedText) return null;
  
  const parts = encryptedText.split(':');
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted text format');
  }
  
  const iv = Buffer.from(parts[0], 'hex');
  const authTag = Buffer.from(parts[1], 'hex');
  const encryptedData = parts[2];
  
  const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(ENCRYPTION_KEY), iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

/**
 * Hashes text using SHA-256 (for non-reversible hashing)
 * 
 * @param {string} text - The text to hash
 * @returns {string} - Hashed text
 */
function hash(text) {
  if (!text) return null;
  return crypto.createHash('sha256').update(text).digest('hex');
}

/**
 * Anonymizes personally identifiable information (PII) in text
 * This is a simple implementation - in production, use more sophisticated NLP techniques
 * 
 * @param {string} text - The text to anonymize
 * @returns {string} - Anonymized text
 */
function anonymizePII(text) {
  if (!text) return null;
  
  // Simple pattern replacements for common PII
  // In production, use more sophisticated NLP-based entity recognition
  let anonymized = text;
  
  // Replace email patterns
  anonymized = anonymized.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[EMAIL]');
  
  // Replace phone number patterns (simple version)
  anonymized = anonymized.replace(/(\+\d{1,3}[\s.-])?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/g, '[PHONE]');
  
  // Replace common name patterns (very simplistic approach)
  anonymized = anonymized.replace(/(?:Mr\.|Mrs\.|Ms\.|Dr\.) [A-Z][a-z]+ [A-Z][a-z]+/g, '[NAME]');
  
  return anonymized;
}

module.exports = {
  encrypt,
  decrypt,
  hash,
  anonymizePII
}; 