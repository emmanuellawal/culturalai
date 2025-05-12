/**
 * Cultural Norms API Routes
 */

const express = require('express');
const router = express.Router();
const { executeQuery } = require('../utils/database');
const { v4: uuidv4 } = require('uuid');

/**
 * GET /api/norms
 * Get all cultural norms, optionally filtered by culture
 */
router.get('/', async (req, res) => {
  try {
    const { cultureId, category } = req.query;
    let query = 'SELECT * FROM CulturalNorms';
    const params = {};
    
    // Apply filters if provided
    if (cultureId || category) {
      query += ' WHERE';
      
      if (cultureId) {
        query += ' CultureID = @cultureId';
        params.cultureId = cultureId;
      }
      
      if (cultureId && category) {
        query += ' AND';
      }
      
      if (category) {
        query += ' Category = @category';
        params.category = category;
      }
    }
    
    const norms = await executeQuery(query, params);
    res.json(norms);
  } catch (error) {
    console.error('Error getting cultural norms:', error);
    res.status(500).json({ message: 'Failed to get cultural norms', error: error.message });
  }
});

/**
 * GET /api/norms/:id
 * Get a cultural norm by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const norms = await executeQuery(
      'SELECT * FROM CulturalNorms WHERE NormID = @id',
      { id }
    );
    
    if (norms.length === 0) {
      return res.status(404).json({ message: 'Cultural norm not found' });
    }
    
    res.json(norms[0]);
  } catch (error) {
    console.error('Error getting cultural norm:', error);
    res.status(500).json({ message: 'Failed to get cultural norm', error: error.message });
  }
});

/**
 * POST /api/norms
 * Create a new cultural norm
 */
router.post('/', async (req, res) => {
  try {
    const { 
      cultureId, 
      category, 
      subCategory, 
      description, 
      doBehavior, 
      dontBehavior, 
      explanation, 
      severityLevel 
    } = req.body;
    
    // Validate required fields
    if (!cultureId || !category || !description || !doBehavior || !dontBehavior || !explanation || !severityLevel) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Check if the culture exists
    const cultures = await executeQuery(
      'SELECT COUNT(*) as count FROM Cultures WHERE CultureID = @cultureId',
      { cultureId }
    );
    
    if (cultures[0].count === 0) {
      return res.status(404).json({ message: 'Culture not found' });
    }
    
    // Generate UUID
    const normId = `norm-${uuidv4()}`;
    
    await executeQuery(
      `INSERT INTO CulturalNorms (
        NormID, CultureID, Category, SubCategory, Description, 
        DoBehavior, DontBehavior, Explanation, SeverityLevel, LastUpdated
      ) VALUES (
        @normId, @cultureId, @category, @subCategory, @description,
        @doBehavior, @dontBehavior, @explanation, @severityLevel, GETDATE()
      )`,
      {
        normId,
        cultureId,
        category,
        subCategory: subCategory || null,
        description,
        doBehavior,
        dontBehavior,
        explanation,
        severityLevel
      }
    );
    
    res.status(201).json({ 
      normId,
      cultureId,
      category,
      subCategory,
      description,
      doBehavior,
      dontBehavior,
      explanation,
      severityLevel,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error creating cultural norm:', error);
    res.status(500).json({ message: 'Failed to create cultural norm', error: error.message });
  }
});

/**
 * PUT /api/norms/:id
 * Update a cultural norm
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      cultureId, 
      category, 
      subCategory, 
      description, 
      doBehavior, 
      dontBehavior, 
      explanation, 
      severityLevel 
    } = req.body;
    
    // Check if norm exists
    const norms = await executeQuery(
      'SELECT COUNT(*) as count FROM CulturalNorms WHERE NormID = @id',
      { id }
    );
    
    if (norms[0].count === 0) {
      return res.status(404).json({ message: 'Cultural norm not found' });
    }
    
    // Update the norm
    await executeQuery(
      `UPDATE CulturalNorms 
       SET CultureID = @cultureId,
           Category = @category,
           SubCategory = @subCategory,
           Description = @description,
           DoBehavior = @doBehavior,
           DontBehavior = @dontBehavior,
           Explanation = @explanation,
           SeverityLevel = @severityLevel,
           LastUpdated = GETDATE()
       WHERE NormID = @id`,
      {
        id,
        cultureId,
        category,
        subCategory: subCategory || null,
        description,
        doBehavior,
        dontBehavior,
        explanation,
        severityLevel
      }
    );
    
    res.json({
      normId: id,
      cultureId,
      category,
      subCategory,
      description,
      doBehavior,
      dontBehavior,
      explanation,
      severityLevel,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating cultural norm:', error);
    res.status(500).json({ message: 'Failed to update cultural norm', error: error.message });
  }
});

/**
 * DELETE /api/norms/:id
 * Delete a cultural norm
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if norm exists
    const norms = await executeQuery(
      'SELECT COUNT(*) as count FROM CulturalNorms WHERE NormID = @id',
      { id }
    );
    
    if (norms[0].count === 0) {
      return res.status(404).json({ message: 'Cultural norm not found' });
    }
    
    // Delete the norm
    await executeQuery(
      'DELETE FROM CulturalNorms WHERE NormID = @id',
      { id }
    );
    
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting cultural norm:', error);
    res.status(500).json({ message: 'Failed to delete cultural norm', error: error.message });
  }
});

module.exports = router; 