/**
 * Admin routes for Cultural Knowledge Base (CKB) management
 */

const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { 
  validateCulture, 
  validateCulturalNorm, 
  validateIdiom, 
  validateScenario, 
  validateScenarioChoice 
} = require('../utils/validation');

// Mock database for MVP (replace with actual database in production)
const mockDb = {
  cultures: [
    {
      CultureID: 'jp-001',
      CultureName: 'Japanese',
      Region: 'East Asia',
      PrimaryLanguage: 'Japanese',
      Description: 'Japan has a rich cultural heritage spanning thousands of years, with strong emphasis on politeness, social harmony, and respect for tradition.',
      LastUpdated: new Date('2023-05-01')
    },
    {
      CultureID: 'ar-001',
      CultureName: 'Arabic (Gulf)',
      Region: 'Middle East',
      PrimaryLanguage: 'Arabic',
      Description: 'Gulf Arabic cultures value hospitality, respect, family bonds, and religious traditions, with distinct customs around greetings and social interactions.',
      LastUpdated: new Date('2023-05-02')
    },
    {
      CultureID: 'br-001',
      CultureName: 'Brazilian',
      Region: 'South America',
      PrimaryLanguage: 'Portuguese',
      Description: 'Brazilian culture is known for its warmth, diversity, and rich expressions in music, cuisine, and social gatherings, with relaxed yet specific social norms.',
      LastUpdated: new Date('2023-05-03')
    }
  ],
  culturalNorms: [
    {
      NormID: 'jp-norm-001',
      CultureID: 'jp-001',
      Category: 'Greeting',
      SubCategory: 'Bowing',
      Description: 'Bowing etiquette in Japan',
      DoBehavior: 'Bow when greeting someone, with the depth of bow reflecting the level of respect.',
      DontBehavior: 'Don\'t offer a handshake first, and don\'t bow with hands in pockets or while chewing gum.',
      Explanation: 'Bowing is an essential part of Japanese culture, showing respect and social status. The deeper and longer the bow, the more respect is shown.',
      SeverityLevel: 'High',
      LastUpdated: new Date('2023-05-01')
    }
  ],
  idioms: [
    {
      IdiomID: 'jp-idiom-001',
      CultureID: 'jp-001',
      Language: 'Japanese',
      Phrase: '猫の手も借りたい',
      LiteralTranslation: 'I want to borrow even a cat\'s paws',
      Meaning: 'To be extremely busy, needing all the help one can get',
      UsageExamples: ['年末は猫の手も借りたいほど忙しい。', 'We are so busy at the end of the year that we could use even a cat\'s paw.'],
      ContextNotes: 'Used when expressing how busy you are, especially in work contexts',
      PolitenessLevel: 'Neutral',
      LastUpdated: new Date('2023-05-01')
    }
  ],
  scenarios: [],
  scenarioChoices: []
};

// Authentication middleware for admin routes
const authenticateAdmin = (req, res, next) => {
  // In a real implementation, this would check if the user has admin privileges
  // For MVP, we'll use a simple token check
  const adminToken = req.headers['admin-token'];
  
  if (!adminToken || adminToken !== process.env.ADMIN_TOKEN) {
    return res.status(403).json({ error: 'Admin authentication required' });
  }
  
  next();
};

// Apply admin authentication to all routes
router.use(authenticateAdmin);

// GET all cultures (admin view)
router.get('/cultures', (req, res) => {
  try {
    res.json({ cultures: mockDb.cultures });
  } catch (error) {
    console.error('Error fetching cultures:', error);
    res.status(500).json({ error: 'Failed to fetch cultures' });
  }
});

// GET a specific culture (admin view)
router.get('/cultures/:id', (req, res) => {
  try {
    const culture = mockDb.cultures.find(c => c.CultureID === req.params.id);
    
    if (!culture) {
      return res.status(404).json({ error: 'Culture not found' });
    }
    
    res.json({ culture });
  } catch (error) {
    console.error('Error fetching culture:', error);
    res.status(500).json({ error: 'Failed to fetch culture' });
  }
});

// POST create a new culture
router.post('/cultures', (req, res) => {
  try {
    const newCulture = req.body;
    
    // Validate the culture data
    const validationResult = validateCulture(newCulture);
    
    if (!validationResult.isValid) {
      return res.status(400).json({ errors: validationResult.errors });
    }
    
    // Generate a new ID and set LastUpdated
    const cultureToSave = {
      ...newCulture,
      CultureID: `${newCulture.CultureName.substring(0, 2).toLowerCase()}-${uuidv4().substring(0, 6)}`,
      LastUpdated: new Date()
    };
    
    // In a real implementation, this would save to a database
    mockDb.cultures.push(cultureToSave);
    
    res.status(201).json({ 
      message: 'Culture created successfully', 
      culture: cultureToSave 
    });
  } catch (error) {
    console.error('Error creating culture:', error);
    res.status(500).json({ error: 'Failed to create culture' });
  }
});

// PUT update a culture
router.put('/cultures/:id', (req, res) => {
  try {
    const cultureId = req.params.id;
    const updatedCulture = req.body;
    
    // Validate the culture data
    const validationResult = validateCulture(updatedCulture);
    
    if (!validationResult.isValid) {
      return res.status(400).json({ errors: validationResult.errors });
    }
    
    // Find the culture to update
    const cultureIndex = mockDb.cultures.findIndex(c => c.CultureID === cultureId);
    
    if (cultureIndex === -1) {
      return res.status(404).json({ error: 'Culture not found' });
    }
    
    // Update the culture
    mockDb.cultures[cultureIndex] = {
      ...mockDb.cultures[cultureIndex],
      ...updatedCulture,
      CultureID: cultureId, // Ensure ID doesn't change
      LastUpdated: new Date()
    };
    
    res.json({ 
      message: 'Culture updated successfully', 
      culture: mockDb.cultures[cultureIndex] 
    });
  } catch (error) {
    console.error('Error updating culture:', error);
    res.status(500).json({ error: 'Failed to update culture' });
  }
});

// DELETE a culture
router.delete('/cultures/:id', (req, res) => {
  try {
    const cultureId = req.params.id;
    
    // Find the culture to delete
    const cultureIndex = mockDb.cultures.findIndex(c => c.CultureID === cultureId);
    
    if (cultureIndex === -1) {
      return res.status(404).json({ error: 'Culture not found' });
    }
    
    // Delete the culture
    mockDb.cultures.splice(cultureIndex, 1);
    
    // In a real implementation, we would also delete related records or handle cascading deletes
    
    res.json({ message: 'Culture deleted successfully' });
  } catch (error) {
    console.error('Error deleting culture:', error);
    res.status(500).json({ error: 'Failed to delete culture' });
  }
});

// Cultural Norms CRUD operations

// GET all cultural norms for a culture
router.get('/cultures/:cultureId/norms', (req, res) => {
  try {
    const cultureId = req.params.cultureId;
    
    // Check if culture exists
    const cultureExists = mockDb.cultures.some(c => c.CultureID === cultureId);
    
    if (!cultureExists) {
      return res.status(404).json({ error: 'Culture not found' });
    }
    
    // Get norms for this culture
    const norms = mockDb.culturalNorms.filter(n => n.CultureID === cultureId);
    
    res.json({ norms });
  } catch (error) {
    console.error('Error fetching cultural norms:', error);
    res.status(500).json({ error: 'Failed to fetch cultural norms' });
  }
});

// POST create a new cultural norm
router.post('/cultures/:cultureId/norms', (req, res) => {
  try {
    const cultureId = req.params.cultureId;
    const newNorm = req.body;
    
    // Check if culture exists
    const cultureExists = mockDb.cultures.some(c => c.CultureID === cultureId);
    
    if (!cultureExists) {
      return res.status(404).json({ error: 'Culture not found' });
    }
    
    // Ensure the norm is associated with the correct culture
    newNorm.CultureID = cultureId;
    
    // Validate the norm data
    const validationResult = validateCulturalNorm(newNorm);
    
    if (!validationResult.isValid) {
      return res.status(400).json({ errors: validationResult.errors });
    }
    
    // Generate a new ID and set LastUpdated
    const normToSave = {
      ...newNorm,
      NormID: `${cultureId}-norm-${uuidv4().substring(0, 6)}`,
      LastUpdated: new Date()
    };
    
    // In a real implementation, this would save to a database
    mockDb.culturalNorms.push(normToSave);
    
    res.status(201).json({ 
      message: 'Cultural norm created successfully', 
      norm: normToSave 
    });
  } catch (error) {
    console.error('Error creating cultural norm:', error);
    res.status(500).json({ error: 'Failed to create cultural norm' });
  }
});

// Similar CRUD operations for idioms, scenarios, and scenario choices would follow the same pattern
// with appropriate validation using the validation utilities

// Export the router
module.exports = router; 