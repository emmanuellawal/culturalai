import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';
import { getToken } from './authService';

/**
 * Analyze text for cultural nuances
 * @param text The text to analyze
 * @param cultureId The ID of the target culture
 * @param isMyText Whether this is the user's own text (true) or someone else's (false)
 * @returns Analysis results
 */
export const analyzeText = async (
  text: string,
  cultureId: string,
  isMyText: boolean
) => {
  try {
    const token = await getToken();
    
    const response = await axios.post(
      `${API_BASE_URL}/analysis/text`,
      {
        text,
        cultureId,
        textOrigin: isMyText ? 'mine' : 'theirs'
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error analyzing text:', error);
    throw error;
  }
};

/**
 * Mock implementation for text analysis during development
 * This can be used until the backend API is fully implemented
 */
export const mockAnalyzeText = async (
  text: string,
  cultureId: string,
  isMyText: boolean
) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // For demo purposes, return mock data based on input
  const containsIdiom = text.toLowerCase().includes('break a leg') || 
                       text.toLowerCase().includes('piece of cake');
  
  const containsFormalityIssue = text.toLowerCase().includes('hey') || 
                               text.toLowerCase().includes('whats up');
  
  const mockResponse = {
    summary: `Analysis of text in relation to ${cultureId === 'jp' ? 'Japanese' : 
              cultureId === 'de' ? 'German' : 
              cultureId === 'sa' ? 'Saudi Arabian' : 'selected'} culture.`,
    issues: []
  };
  
  if (containsIdiom) {
    mockResponse.issues.push({
      type: 'Idiom',
      text: 'break a leg',
      explanation: 'This English idiom wishing someone good luck may not translate well in other cultures and could be confusing.',
      suggestion: 'Consider using "Good luck" or "All the best" instead.',
      idiomId: 'idiom123'
    });
  }
  
  if (containsFormalityIssue) {
    mockResponse.issues.push({
      type: 'Formality',
      text: text.toLowerCase().includes('hey') ? 'hey' : 'whats up',
      explanation: 'This greeting is too casual for formal or initial business interactions in many cultures.',
      suggestion: 'Consider "Good morning/afternoon" or "Hello" for a more universally appropriate greeting.'
    });
  }
  
  // If analyzing someone else's text (interpretation aid)
  if (!isMyText && text.length > 20) {
    mockResponse.issues.push({
      type: 'Context',
      text: '(General observation)',
      explanation: 'When interpreting this message, consider that in some cultures, communication may be more indirect. Look for subtle cues rather than explicit statements.'
    });
  }
  
  // If no specific issues found, add a general note
  if (mockResponse.issues.length === 0) {
    mockResponse.issues.push({
      type: 'General',
      text: '(No specific issues detected)',
      explanation: 'No obvious cultural concerns detected in the provided text. However, always consider context and relationship with the recipient.'
    });
  }
  
  // Add alternative phrasings if appropriate (for user's own text)
  if (isMyText && text.length > 10) {
    mockResponse.alternatives = [
      'A more culturally adapted version might be: "' + text.replace(/hey/i, 'Hello').replace(/whats up/i, 'How are you') + '"',
      'For formal contexts: "' + text.replace(/break a leg/i, 'I wish you success').replace(/piece of cake/i, 'very straightforward') + '"'
    ];
  }
  
  return mockResponse;
};

// Use mock implementation for now
// When real backend is ready, replace this with the actual implementation
export { mockAnalyzeText as analyzeText }; 