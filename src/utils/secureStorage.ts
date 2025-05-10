import * as SecureStore from 'expo-secure-store';
import { User } from '../types/user';

// Key constants
const USER_KEY = 'cultural_ai_user';
const TOKEN_KEY = 'cultural_ai_token';

// Store user data securely
export const storeUserData = async (user: User): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(user);
    await SecureStore.setItemAsync(USER_KEY, jsonValue);
  } catch (error) {
    console.error('Error storing user data:', error);
    throw error;
  }
};

// Retrieve user data
export const getUserData = async (): Promise<User | null> => {
  try {
    const jsonValue = await SecureStore.getItemAsync(USER_KEY);
    return jsonValue ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error retrieving user data:', error);
    return null;
  }
};

// Store JWT token
export const storeToken = async (token: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  } catch (error) {
    console.error('Error storing token:', error);
    throw error;
  }
};

// Retrieve JWT token
export const getToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch (error) {
    console.error('Error retrieving token:', error);
    return null;
  }
};

// Clear all stored data (for logout)
export const clearStorage = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(USER_KEY);
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  } catch (error) {
    console.error('Error clearing storage:', error);
    throw error;
  }
}; 