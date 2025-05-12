/**
 * Cultures API Routes
 */

const express = require('express');
const router = express.Router();
const { executeQuery } = require('../utils/database');
const { v4: uuidv4 } = require('uuid');

/**
 * GET /api/cultures
 * Get all cultures
 */
router.get('/', async (req, res) => {
  try {
    const cultures = await executeQuery(
      'SELECT CultureID, CultureName, Region, PrimaryLanguage, Description, LastUpdated FROM Cultures'
    );
    res.json(cultures);
  } catch (error) {
    console.error('Error getting cultures:', error);
    res.status(500).json({ message: 'Failed to get cultures', error: error.message });
  }
});

/**
 * GET /api/cultures/:id
 * Get a culture by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const cultures = await executeQuery(
      'SELECT CultureID, CultureName, Region, PrimaryLanguage, Description, LastUpdated FROM Cultures WHERE CultureID = @id',
      { id }
    );
    
    if (cultures.length === 0) {
      return res.status(404).json({ message: 'Culture not found' });
    }
    
    res.json(cultures[0]);
  } catch (error) {
    console.error('Error getting culture:', error);
    res.status(500).json({ message: 'Failed to get culture', error: error.message });
  }
});

/**
 * POST /api/cultures
 * Create a new culture
 */
router.post('/', async (req, res) => {
  try {
    const { cultureName, region, primaryLanguage, description } = req.body;
    
    // Validate required fields
    if (!cultureName || !region || !primaryLanguage || !description) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Generate UUID
    const cultureId = `culture-${uuidv4()}`;
    
    await executeQuery(
      `INSERT INTO Cultures (CultureID, CultureName, Region, PrimaryLanguage, Description, LastUpdated)
       VALUES (@cultureId, @cultureName, @region, @primaryLanguage, @description, GETDATE())`,
      {
        cultureId,
        cultureName,
        region,
        primaryLanguage,
        description
      }
    );
    
    res.status(201).json({ 
      cultureId,
      cultureName,
      region,
      primaryLanguage,
      description,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error creating culture:', error);
    res.status(500).json({ message: 'Failed to create culture', error: error.message });
  }
});

/**
 * PUT /api/cultures/:id
 * Update a culture
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { cultureName, region, primaryLanguage, description } = req.body;
    
    // Check if culture exists
    const cultures = await executeQuery(
      'SELECT COUNT(*) as count FROM Cultures WHERE CultureID = @id',
      { id }
    );
    
    if (cultures[0].count === 0) {
      return res.status(404).json({ message: 'Culture not found' });
    }
    
    // Update the culture
    await executeQuery(
      `UPDATE Cultures 
       SET CultureName = @cultureName, 
           Region = @region, 
           PrimaryLanguage = @primaryLanguage, 
           Description = @description,
           LastUpdated = GETDATE()
       WHERE CultureID = @id`,
      {
        id,
        cultureName,
        region,
        primaryLanguage,
        description
      }
    );
    
    res.json({ 
      cultureId: id,
      cultureName,
      region,
      primaryLanguage,
      description,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating culture:', error);
    res.status(500).json({ message: 'Failed to update culture', error: error.message });
  }
});

/**
 * DELETE /api/cultures/:id
 * Delete a culture
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if culture exists
    const cultures = await executeQuery(
      'SELECT COUNT(*) as count FROM Cultures WHERE CultureID = @id',
      { id }
    );
    
    if (cultures[0].count === 0) {
      return res.status(404).json({ message: 'Culture not found' });
    }
    
    // Delete the culture
    await executeQuery(
      'DELETE FROM Cultures WHERE CultureID = @id',
      { id }
    );
    
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting culture:', error);
    res.status(500).json({ message: 'Failed to delete culture', error: error.message });
  }
});

module.exports = router; 