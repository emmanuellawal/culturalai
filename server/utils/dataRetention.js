/**
 * Data Retention Policy Utilities
 * 
 * This module provides functions to implement data retention policies
 * for the Cultural AI application.
 */

const { anonymizePII } = require('./encryption');

// Configuration for data retention periods (in milliseconds)
const RETENTION_PERIODS = {
  // For MVP, we're not storing analyzed text beyond the session
  ANALYZED_TEXT: 0, // 0 means don't store at all
  
  // For future implementation
  USER_ACTIVITY_LOGS: 90 * 24 * 60 * 60 * 1000, // 90 days
  FEEDBACK_DATA: 365 * 24 * 60 * 60 * 1000, // 1 year
};

/**
 * Determines if data should be retained based on its type and age
 * 
 * @param {string} dataType - Type of data (e.g., 'ANALYZED_TEXT')
 * @param {Date} creationDate - When the data was created
 * @returns {boolean} - True if data should be retained, false if it should be deleted
 */
function shouldRetainData(dataType, creationDate) {
  if (!RETENTION_PERIODS[dataType]) {
    // If no specific retention period is defined, retain by default
    return true;
  }
  
  // If retention period is 0, don't retain at all
  if (RETENTION_PERIODS[dataType] === 0) {
    return false;
  }
  
  const now = new Date();
  const ageInMs = now - creationDate;
  
  return ageInMs <= RETENTION_PERIODS[dataType];
}

/**
 * Processes text according to data retention policy
 * For analyzed text in MVP, we don't store it at all
 * 
 * @param {string} text - The text to process
 * @param {string} dataType - Type of data (e.g., 'ANALYZED_TEXT')
 * @returns {string|null} - Processed text according to retention policy, or null if it shouldn't be stored
 */
function processTextForStorage(text, dataType = 'ANALYZED_TEXT') {
  // For analyzed text in MVP, don't store at all
  if (dataType === 'ANALYZED_TEXT' && RETENTION_PERIODS[dataType] === 0) {
    return null;
  }
  
  // For other types of data, anonymize PII before storage
  return anonymizePII(text);
}

/**
 * Creates a logger that respects data retention policies
 * 
 * @param {Object} options - Logger options
 * @returns {Function} - A logging function that respects data retention policies
 */
function createPrivacyAwareLogger(options = {}) {
  return function log(message, data = {}, dataType = 'ANALYZED_TEXT') {
    // For analyzed text, don't log the actual content
    if (dataType === 'ANALYZED_TEXT') {
      // Log metadata only, not the actual text
      console.log(message, {
        timestamp: new Date().toISOString(),
        dataType,
        contentLength: data.text ? data.text.length : 0,
        // Include other non-sensitive metadata
        ...Object.fromEntries(
          Object.entries(data).filter(([key]) => key !== 'text')
        )
      });
      return;
    }
    
    // For other types of data, anonymize before logging
    const safeData = { ...data };
    if (safeData.text) {
      safeData.text = anonymizePII(safeData.text);
    }
    
    console.log(message, {
      timestamp: new Date().toISOString(),
      dataType,
      ...safeData
    });
  };
}

// Create a privacy-aware logger instance
const privacyLogger = createPrivacyAwareLogger();

module.exports = {
  shouldRetainData,
  processTextForStorage,
  createPrivacyAwareLogger,
  privacyLogger,
  RETENTION_PERIODS
}; 