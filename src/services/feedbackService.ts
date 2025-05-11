import { API_BASE_URL } from '../utils/config';
import { getAuthToken } from './authService';

/**
 * Feedback data interface
 */
export interface FeedbackData {
  analysisId?: string;
  analysisType?: string;
  cultureId?: string;
  feedbackType: string;
  feedbackText: string;
  timestamp: string;
}

/**
 * Submit user feedback about AI analysis
 * 
 * @param {FeedbackData} feedback - The feedback data to submit
 * @returns {Promise<{ success: boolean, message?: string }>} Result of the submission
 */
export const submitFeedback = async (feedback: FeedbackData): Promise<{ success: boolean, message?: string }> => {
  try {
    const token = await getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/api/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(feedback)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to submit feedback');
    }
    
    return {
      success: true,
      message: data.message
    };
  } catch (error) {
    console.error('Feedback submission error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Get feedback categories
 * 
 * @returns {Promise<string[]>} List of feedback categories
 */
export const getFeedbackCategories = async (): Promise<string[]> => {
  return [
    'bias',
    'inaccuracy',
    'offensive',
    'other'
  ];
}; 