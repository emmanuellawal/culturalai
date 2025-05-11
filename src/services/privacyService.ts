import { API_BASE_URL } from '../utils/config';
import { getAuthToken } from './authService';

/**
 * Request deletion of all user data
 * 
 * @returns {Promise<{ success: boolean, message?: string }>} Result of the request
 */
export const requestDataDeletion = async (): Promise<{ success: boolean, message?: string }> => {
  try {
    const token = await getAuthToken();
    
    if (!token) {
      throw new Error('Authentication required');
    }
    
    const response = await fetch(`${API_BASE_URL}/api/user/data-deletion-request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to request data deletion');
    }
    
    return {
      success: true,
      message: data.message
    };
  } catch (error) {
    console.error('Data deletion request error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Request export of all user data
 * 
 * @returns {Promise<{ success: boolean, message?: string }>} Result of the request
 */
export const requestDataExport = async (): Promise<{ success: boolean, message?: string }> => {
  try {
    const token = await getAuthToken();
    
    if (!token) {
      throw new Error('Authentication required');
    }
    
    const response = await fetch(`${API_BASE_URL}/api/user/data-export-request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to request data export');
    }
    
    return {
      success: true,
      message: data.message
    };
  } catch (error) {
    console.error('Data export request error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}; 