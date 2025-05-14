/**
 * Application Configuration
 * 
 * This file contains configuration settings for the application.
 * Different environments (development, production) can be configured here.
 */

// API Base URL - Change this based on your environment
export const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api'  // Development
  : 'https://api.culturalai.com/api'; // Production

// Feature flags
export const FEATURES = {
  ENABLE_SCENARIO_SIMULATOR: false, // Disabled for MVP
  ENABLE_SPEECH_ANALYSIS: false,    // Disabled for MVP
  ENABLE_IMAGE_ANALYSIS: false,     // Disabled for MVP
};

// App version
export const APP_VERSION = '1.0.0';

// Privacy settings
export const PRIVACY = {
  // How long to keep analyzed text (0 = don't store)
  TEXT_RETENTION_DAYS: 0,
  
  // Default consent settings (user can override)
  DEFAULT_TEXT_ANALYSIS_CONSENT: false,
  DEFAULT_AI_IMPROVEMENT_CONSENT: false,
};

// Timeouts
export const TIMEOUTS = {
  API_REQUEST_MS: 10000, // 10 seconds
  TEXT_ANALYSIS_MS: 15000, // 15 seconds
}; 