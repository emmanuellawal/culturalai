import AsyncStorage from '@react-native-async-storage/async-storage';

const CONSENT_KEYS = {
  TEXT_ANALYSIS: 'consent_text_analysis',
  AI_IMPROVEMENT: 'consent_ai_improvement',
};

/**
 * Stores text analysis consent preference
 * @param hasConsented Whether the user has given consent
 */
export const storeTextAnalysisConsent = async (hasConsented: boolean): Promise<void> => {
  try {
    await AsyncStorage.setItem(CONSENT_KEYS.TEXT_ANALYSIS, hasConsented.toString());
  } catch (error) {
    console.error('Error storing text analysis consent:', error);
  }
};

/**
 * Stores AI improvement data usage consent preference
 * @param hasConsented Whether the user has given consent
 */
export const storeAIImprovementConsent = async (hasConsented: boolean): Promise<void> => {
  try {
    await AsyncStorage.setItem(CONSENT_KEYS.AI_IMPROVEMENT, hasConsented.toString());
  } catch (error) {
    console.error('Error storing AI improvement consent:', error);
  }
};

/**
 * Retrieves text analysis consent preference
 * @returns Boolean indicating if user has consented, or null if no preference has been set
 */
export const getTextAnalysisConsent = async (): Promise<boolean | null> => {
  try {
    const value = await AsyncStorage.getItem(CONSENT_KEYS.TEXT_ANALYSIS);
    if (value === null) {
      return null;
    }
    return value === 'true';
  } catch (error) {
    console.error('Error retrieving text analysis consent:', error);
    return null;
  }
};

/**
 * Retrieves AI improvement consent preference
 * @returns Boolean indicating if user has consented, or null if no preference has been set
 */
export const getAIImprovementConsent = async (): Promise<boolean | null> => {
  try {
    const value = await AsyncStorage.getItem(CONSENT_KEYS.AI_IMPROVEMENT);
    if (value === null) {
      return null;
    }
    return value === 'true';
  } catch (error) {
    console.error('Error retrieving AI improvement consent:', error);
    return null;
  }
};

/**
 * Resets all consent preferences
 */
export const resetAllConsents = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      CONSENT_KEYS.TEXT_ANALYSIS,
      CONSENT_KEYS.AI_IMPROVEMENT,
    ]);
  } catch (error) {
    console.error('Error resetting consents:', error);
  }
}; 