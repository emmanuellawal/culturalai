/**
 * Cultural Analysis API Routes
 */

const express = require('express');
const router = express.Router();
const { executeQuery } = require('../utils/database');
const { analyzeCulturalContext, translateIdiom } = require('../utils/openai');
const logger = require('../utils/logger');

/**
 * POST /api/analysis/text
 * Analyze text for cultural appropriateness
 */
router.post('/text', async (req, res) => {
  try {
    const { text, cultureId, textOrigin = 'mine' } = req.body;
    
    // Validate required fields
    if (!text || !cultureId) {
      return res.status(400).json({ message: 'Text and culture ID are required' });
    }
    
    // Look up culture name from the database
    const cultures = await executeQuery(
      'SELECT CultureName FROM Cultures WHERE CultureID = @cultureId',
      { cultureId }
    );
    
    if (cultures.length === 0) {
      return res.status(404).json({ message: 'Culture not found' });
    }
    
    const cultureName = cultures[0].CultureName;
    
    // Call OpenAI to analyze the text
    const analysis = await analyzeCulturalContext(text, cultureId, cultureName, textOrigin);
    
    res.json(analysis);
  } catch (error) {
    logger.error('Error analyzing text:', error);
    res.status(500).json({ message: 'Failed to analyze text', error: error.message });
  }
});

/**
 * POST /api/analysis/translate-idiom
 * Translate an idiom between cultures
 */
router.post('/translate-idiom', async (req, res) => {
  try {
    const { idiom, sourceCultureId, targetCultureId } = req.body;
    
    // Validate required fields
    if (!idiom || !sourceCultureId || !targetCultureId) {
      return res.status(400).json({ message: 'Idiom, source culture, and target culture are required' });
    }
    
    // Look up culture names from the database
    const cultures = await executeQuery(
      'SELECT CultureID, CultureName FROM Cultures WHERE CultureID IN (@sourceCultureId, @targetCultureId)',
      { 
        sourceCultureId,
        targetCultureId
      }
    );
    
    if (cultures.length < 2) {
      return res.status(404).json({ message: 'One or both cultures not found' });
    }
    
    const sourceCulture = cultures.find(c => c.CultureID === sourceCultureId)?.CultureName;
    const targetCulture = cultures.find(c => c.CultureID === targetCultureId)?.CultureName;
    
    // Call OpenAI to translate the idiom
    const translation = await translateIdiom(idiom, sourceCulture, targetCulture);
    
    res.json(translation);
  } catch (error) {
    logger.error('Error translating idiom:', error);
    res.status(500).json({ message: 'Failed to translate idiom', error: error.message });
  }
});

module.exports = router; 