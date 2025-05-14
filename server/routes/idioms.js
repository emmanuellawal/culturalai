/**
 * Idioms API Routes
 */

const express = require('express');
const router = express.Router();
const { executeQuery } = require('../utils/database');
const { v4: uuidv4 } = require('uuid');

/**
 * GET /api/idioms
 * Get all idioms, optionally filtered by culture
 */
router.get('/', async (req, res, next) => {
  try {
    const { cultureId, language } = req.query;
    let query = 'SELECT * FROM Idioms';
    const params = {};
    
    // Apply filters if provided
    if (cultureId || language) {
      query += ' WHERE';
      
      if (cultureId) {
        query += ' CultureID = @cultureId';
        params.cultureId = cultureId;
      }
      
      if (cultureId && language) {
        query += ' AND';
      }
      
      if (language) {
        query += ' Language = @language';
        params.language = language;
      }
    }
    
    const idioms = await executeQuery(query, params);
    
    // Get usage examples for each idiom
    for (const idiom of idioms) {
      const examples = await executeQuery(
        'SELECT * FROM IdiomUsageExamples WHERE IdiomID = @idiomId',
        { idiomId: idiom.IdiomID }
      );
      idiom.examples = examples;
    }
    
    res.json(idioms);
  } catch (error) {
    console.error('Error getting idioms:', error);
    next(error);
  }
});

/**
 * GET /api/idioms/:id
 * Get an idiom by ID
 */
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const idioms = await executeQuery(
      'SELECT * FROM Idioms WHERE IdiomID = @id',
      { id }
    );
    
    if (idioms.length === 0) {
      return res.status(404).json({ message: 'Idiom not found' });
    }
    
    const idiom = idioms[0];
    
    // Get usage examples
    const examples = await executeQuery(
      'SELECT * FROM IdiomUsageExamples WHERE IdiomID = @idiomId',
      { idiomId: id }
    );
    
    idiom.examples = examples;
    
    res.json(idiom);
  } catch (error) {
    console.error('Error getting idiom:', error);
    next(error);
  }
});

/**
 * POST /api/idioms
 * Create a new idiom
 */
router.post('/', async (req, res, next) => {
  try {
    const { 
      cultureId, 
      language, 
      phrase, 
      literalTranslation, 
      meaning, 
      contextNotes, 
      politenessLevel,
      examples = [] 
    } = req.body;
    
    // Validate required fields
    if (!cultureId || !language || !phrase || !literalTranslation || !meaning || !politenessLevel) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Check if the culture exists
    const cultures = await executeQuery(
      'SELECT COUNT(*) as count FROM Cultures WHERE CultureID = @cultureId',
      { cultureId }
    );
    
    // Add safety check before accessing index 0
    if (!cultures || cultures.length === 0 || cultures[0].count === 0) {
      return res.status(404).json({ message: 'Culture not found' });
    }
    
    // Generate UUID
    const idiomId = `idiom-${uuidv4()}`;
    
    await executeQuery(
      `INSERT INTO Idioms (
        IdiomID, CultureID, Language, Phrase, LiteralTranslation, 
        Meaning, ContextNotes, PolitenessLevel, LastUpdated
      ) VALUES (
        @idiomId, @cultureId, @language, @phrase, @literalTranslation,
        @meaning, @contextNotes, @politenessLevel, GETDATE()
      )`,
      {
        idiomId,
        cultureId,
        language,
        phrase,
        literalTranslation,
        meaning,
        contextNotes: contextNotes || null,
        politenessLevel
      }
    );
    
    // Add usage examples if provided
    for (const example of examples) {
      const exampleId = `example-${uuidv4()}`;
      await executeQuery(
        `INSERT INTO IdiomUsageExamples (ExampleID, IdiomID, ExampleText)
         VALUES (@exampleId, @idiomId, @exampleText)`,
        {
          exampleId,
          idiomId,
          exampleText: example
        }
      );
    }
    
    res.status(201).json({ 
      idiomId,
      cultureId,
      language,
      phrase,
      literalTranslation,
      meaning,
      contextNotes,
      politenessLevel,
      examples,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error creating idiom:', error);
    next(error);
  }
});

/**
 * PUT /api/idioms/:id
 * Update an idiom
 */
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { 
      cultureId, 
      language, 
      phrase, 
      literalTranslation, 
      meaning, 
      contextNotes, 
      politenessLevel,
      examples = [] 
    } = req.body;
    
    // Check if idiom exists
    const idioms = await executeQuery(
      'SELECT COUNT(*) as count FROM Idioms WHERE IdiomID = @id',
      { id }
    );
    
    // Add safety check before accessing index 0
    if (!idioms || idioms.length === 0 || idioms[0].count === 0) {
      return res.status(404).json({ message: 'Idiom not found' });
    }
    
    // Update the idiom
    await executeQuery(
      `UPDATE Idioms 
       SET CultureID = @cultureId,
           Language = @language,
           Phrase = @phrase,
           LiteralTranslation = @literalTranslation,
           Meaning = @meaning,
           ContextNotes = @contextNotes,
           PolitenessLevel = @politenessLevel,
           LastUpdated = GETDATE()
       WHERE IdiomID = @id`,
      {
        id,
        cultureId,
        language,
        phrase,
        literalTranslation,
        meaning,
        contextNotes: contextNotes || null,
        politenessLevel
      }
    );
    
    // Remove existing examples and add new ones
    await executeQuery(
      'DELETE FROM IdiomUsageExamples WHERE IdiomID = @idiomId',
      { idiomId: id }
    );
    
    for (const example of examples) {
      const exampleId = `example-${uuidv4()}`;
      await executeQuery(
        `INSERT INTO IdiomUsageExamples (ExampleID, IdiomID, ExampleText)
         VALUES (@exampleId, @idiomId, @exampleText)`,
        {
          exampleId,
          idiomId: id,
          exampleText: example
        }
      );
    }
    
    res.json({
      idiomId: id,
      cultureId,
      language,
      phrase,
      literalTranslation,
      meaning,
      contextNotes,
      politenessLevel,
      examples,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating idiom:', error);
    next(error);
  }
});

/**
 * DELETE /api/idioms/:id
 * Delete an idiom
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Check if idiom exists
    const idioms = await executeQuery(
      'SELECT COUNT(*) as count FROM Idioms WHERE IdiomID = @id',
      { id }
    );
    
    // Add safety check before accessing index 0
    if (!idioms || idioms.length === 0 || idioms[0].count === 0) {
      return res.status(404).json({ message: 'Idiom not found' });
    }
    
    // Delete the idiom (usage examples will be deleted due to CASCADE)
    await executeQuery(
      'DELETE FROM Idioms WHERE IdiomID = @id',
      { id }
    );
    
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting idiom:', error);
    next(error);
  }
});

module.exports = router; 