/**
 * OpenAI API Integration
 */
const { Configuration, OpenAIApi } = require('openai');
const dotenv = require('dotenv');
const logger = require('./logger');

// Load environment variables
dotenv.config();

// Check if API key is set
if (!process.env.OPENAI_API_KEY) {
  logger.warn('OpenAI API key is not set. Cultural analysis features will not work properly.');
}

// OpenAI configuration
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
const defaultModel = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';

/**
 * Analyze text for cultural appropriateness
 * 
 * @param {string} text - The text to analyze
 * @param {string} cultureId - The ID of the culture for context
 * @param {string} cultureName - The name of the culture
 * @param {string} textOrigin - Whether this is the user's text ('mine') or someone else's ('theirs')
 * @returns {Promise<object>} - Analysis results
 */
async function analyzeCulturalContext(text, cultureId, cultureName, textOrigin = 'mine') {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return mockAnalysis(text, cultureName, textOrigin);
    }

    const prompt = `
You are a cultural intelligence expert who helps people communicate effectively across different cultures.

I need you to analyze the following text in the context of ${cultureName} culture.
The text is ${textOrigin === 'mine' ? 'something I wrote' : 'written by someone from this culture'}.

Text to analyze: "${text}"

Provide analysis in the following JSON format:
{
  "summary": "Brief summary of your analysis",
  "issues": [
    {
      "type": "Type of issue (Idiom, Formality, Directness, etc.)",
      "text": "The specific text that raised this issue",
      "explanation": "Explanation of why this might be an issue in this cultural context",
      "suggestion": "Suggested alternative if appropriate"
    }
  ],
  "alternatives": [
    "Alternative phrasings that would be more culturally appropriate"
  ]
}

If no issues are found, return an appropriate message in the summary and an empty issues array.
`;

    const response = await openai.createChatCompletion({
      model: defaultModel,
      messages: [
        { role: 'system', content: 'You are a cultural intelligence expert who helps with cross-cultural communication.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    const analysisText = response.data.choices[0].message.content.trim();
    const analysis = JSON.parse(analysisText);
    
    return analysis;
  } catch (error) {
    logger.error('Error in OpenAI analysis:', error);
    return {
      summary: 'Error analyzing text. Please try again later.',
      issues: [],
      alternatives: []
    };
  }
}

/**
 * Translate an idiom between cultures
 * 
 * @param {string} idiom - The idiom to translate
 * @param {string} sourceCulture - The source culture
 * @param {string} targetCulture - The target culture
 * @returns {Promise<object>} - Translation results
 */
async function translateIdiom(idiom, sourceCulture, targetCulture) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return {
        originalIdiom: idiom,
        translation: 'API key not configured. Translation unavailable.',
        explanation: 'Please configure the OpenAI API key to use this feature.',
        culturalNotes: []
      };
    }

    const prompt = `
Translate the following idiom from ${sourceCulture} culture to an equivalent in ${targetCulture} culture.

Idiom: "${idiom}"

Provide the translation in the following JSON format:
{
  "originalIdiom": "${idiom}",
  "translation": "The closest equivalent idiom in ${targetCulture} culture",
  "literalTranslation": "The literal translation of the original idiom",
  "explanation": "Explanation of the meaning and how it relates to the original",
  "culturalNotes": [
    "Important cultural notes or context about this idiom",
    "Any usage guidelines or warnings"
  ]
}

If there is no clear equivalent, suggest the closest concept and explain the differences.
`;

    const response = await openai.createChatCompletion({
      model: defaultModel,
      messages: [
        { role: 'system', content: 'You are a linguistic expert specializing in cross-cultural idioms and expressions.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const translationText = response.data.choices[0].message.content.trim();
    const translation = JSON.parse(translationText);
    
    return translation;
  } catch (error) {
    logger.error('Error in idiom translation:', error);
    return {
      originalIdiom: idiom,
      translation: 'Error translating idiom. Please try again later.',
      explanation: 'An error occurred during translation.',
      culturalNotes: []
    };
  }
}

/**
 * Mock analysis for when API key is not available
 * @private
 */
function mockAnalysis(text, cultureName, textOrigin) {
  const mockAnalysis = {
    summary: `Analysis of text in relation to ${cultureName} culture.`,
    issues: []
  };
  
  // Check for idioms (very simplified)
  if (text.toLowerCase().includes('break a leg') || text.toLowerCase().includes('piece of cake')) {
    mockAnalysis.issues.push({
      type: 'Idiom',
      text: text.toLowerCase().includes('break a leg') ? 'break a leg' : 'piece of cake',
      explanation: 'This English idiom may not translate well in other cultures and could be confusing.',
      suggestion: 'Consider using more direct language instead of idioms when communicating across cultures.'
    });
  }
  
  // Check for formality issues (very simplified)
  if (text.toLowerCase().includes('hey') || text.toLowerCase().includes('whats up')) {
    mockAnalysis.issues.push({
      type: 'Formality',
      text: text.toLowerCase().includes('hey') ? 'hey' : 'whats up',
      explanation: 'This greeting is too casual for formal or initial business interactions in many cultures.',
      suggestion: 'Consider "Good morning/afternoon" or "Hello" for a more universally appropriate greeting.'
    });
  }
  
  // If no specific issues found, add a general note
  if (mockAnalysis.issues.length === 0) {
    mockAnalysis.issues.push({
      type: 'General',
      text: '(No specific issues detected)',
      explanation: 'No obvious cultural concerns detected in the provided text. However, always consider context and relationship with the recipient.'
    });
  }
  
  // Add alternative phrasings if appropriate (for user's own text)
  if (textOrigin === 'mine' && text.length > 10) {
    mockAnalysis.alternatives = [
      'A more culturally adapted version might be: "' + text.replace(/hey/i, 'Hello').replace(/whats up/i, 'How are you') + '"',
      'For formal contexts: "' + text.replace(/break a leg/i, 'I wish you success').replace(/piece of cake/i, 'very straightforward') + '"'
    ];
  }
  
  return mockAnalysis;
}

module.exports = {
  analyzeCulturalContext,
  translateIdiom
}; 