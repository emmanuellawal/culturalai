/**
 * Application Constants
 */

// API Configuration
export const API_BASE_URL = 'http://localhost:3000/api';

// App Theme Colors
export const COLORS = {
  primary: '#4A6FA5',
  secondary: '#E6A817',
  background: '#F5F7FA',
  white: '#FFFFFF',
  text: '#4D5156',
  error: '#D93025',
  success: '#34A853',
  warning: '#FBBC05',
  lightGray: '#E1E4E8',
  darkGray: '#A0A5AA',
};

// Storage Keys
export const STORAGE_KEYS = {
  authToken: 'auth_token',
  userId: 'user_id',
  selectedCulture: 'selected_culture',
  userPreferences: 'user_preferences',
};

// App Settings
export const APP_SETTINGS = {
  version: '0.1.0',
  defaultLanguage: 'en',
};

// Timeout Durations (in milliseconds)
export const TIMEOUTS = {
  apiRequest: 10000, // 10 seconds
  tokenRefresh: 300000, // 5 minutes
};

// Screen Names (for navigation)
export const SCREENS = {
  login: 'Login',
  signup: 'SignUp',
  home: 'Home',
  culturalBriefings: 'CulturalBriefings',
  cultureSelection: 'CultureSelection',
  culturalBriefingDetail: 'CulturalBriefingDetail',
  analysis: 'Analysis',
  textAnalysis: 'TextAnalysis',
  idioms: 'Idioms',
  settings: 'Settings',
}; 