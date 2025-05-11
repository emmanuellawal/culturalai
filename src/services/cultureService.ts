import { Culture, CulturalNorm, Idiom, CulturalBriefing, NormCategory, SeverityLevel, PolitenessLevel } from '../types/culture';
import { executeQuery } from '../utils/database';

// Get all available cultures
export const getAllCultures = async (): Promise<Culture[]> => {
  try {
    const cultures = await executeQuery<Culture>(`
      SELECT 
        CultureID as id, 
        CultureName as name, 
        Region as region, 
        PrimaryLanguage as primaryLanguage, 
        Description as description, 
        LastUpdated as lastUpdated 
      FROM Cultures
    `);
    
    return cultures;
  } catch (error) {
    console.error('Error fetching cultures:', error);
    throw error;
  }
};

// Get a specific culture by ID
export const getCultureById = async (cultureId: string): Promise<Culture | null> => {
  try {
    const cultures = await executeQuery<Culture>(`
      SELECT 
        CultureID as id, 
        CultureName as name, 
        Region as region, 
        PrimaryLanguage as primaryLanguage, 
        Description as description, 
        LastUpdated as lastUpdated 
      FROM Cultures 
      WHERE CultureID = @cultureId
    `, { cultureId });
    
    return cultures.length > 0 ? cultures[0] : null;
  } catch (error) {
    console.error(`Error fetching culture with ID ${cultureId}:`, error);
    throw error;
  }
};

// Get all cultural norms for a specific culture
export const getNormsByCultureId = async (cultureId: string): Promise<CulturalNorm[]> => {
  try {
    const norms = await executeQuery<CulturalNorm>(`
      SELECT 
        NormID as id, 
        CultureID as cultureId, 
        Category as category, 
        SubCategory as subCategory, 
        Description as description, 
        DoBehavior as doBehavior, 
        DontBehavior as dontBehavior, 
        Explanation as explanation, 
        SeverityLevel as severityLevel, 
        LastUpdated as lastUpdated 
      FROM CulturalNorms 
      WHERE CultureID = @cultureId
    `, { cultureId });
    
    return norms;
  } catch (error) {
    console.error(`Error fetching norms for culture ID ${cultureId}:`, error);
    throw error;
  }
};

// Get cultural norms by category for a specific culture
export const getNormsByCategory = async (cultureId: string, category: NormCategory): Promise<CulturalNorm[]> => {
  try {
    const norms = await executeQuery<CulturalNorm>(`
      SELECT 
        NormID as id, 
        CultureID as cultureId, 
        Category as category, 
        SubCategory as subCategory, 
        Description as description, 
        DoBehavior as doBehavior, 
        DontBehavior as dontBehavior, 
        Explanation as explanation, 
        SeverityLevel as severityLevel, 
        LastUpdated as lastUpdated 
      FROM CulturalNorms 
      WHERE CultureID = @cultureId AND Category = @category
    `, { cultureId, category });
    
    return norms;
  } catch (error) {
    console.error(`Error fetching norms for culture ID ${cultureId} and category ${category}:`, error);
    throw error;
  }
};

// Get a full cultural briefing for a culture
export const getCulturalBriefing = async (cultureId: string): Promise<CulturalBriefing | null> => {
  try {
    const culture = await getCultureById(cultureId);
    if (!culture) return null;
    
    const norms = await getNormsByCultureId(cultureId);
    
    // Group norms by category
    const normsByCategory = norms.reduce<Record<string, CulturalNorm[]>>((acc, norm) => {
      const category = norm.category.toString();
      if (!acc[category]) acc[category] = [];
      acc[category].push(norm);
      return acc;
    }, {});
    
    return {
      culture,
      normsByCategory,
      lastUpdated: culture.lastUpdated
    };
  } catch (error) {
    console.error(`Error fetching cultural briefing for culture ID ${cultureId}:`, error);
    throw error;
  }
};

// Search for idioms in a specific culture
export const searchIdiomsByCulture = async (cultureId: string, query?: string): Promise<Idiom[]> => {
  try {
    let sql = `
      SELECT 
        i.IdiomID as id, 
        i.CultureID as cultureId, 
        i.Language as language, 
        i.Phrase as phrase, 
        i.LiteralTranslation as literalTranslation, 
        i.Meaning as meaning, 
        i.ContextNotes as contextNotes, 
        i.PolitenessLevel as politenessLevel, 
        i.LastUpdated as lastUpdated
      FROM Idioms i
      WHERE i.CultureID = @cultureId
    `;
    
    const params: any = { cultureId };
    
    if (query && query.trim() !== '') {
      sql += ` AND (i.Phrase LIKE @query OR i.Meaning LIKE @query)`;
      params.query = `%${query}%`;
    }
    
    const idioms = await executeQuery<Idiom>(sql, params);
    
    // Fetch usage examples for each idiom
    for (const idiom of idioms) {
      const usageExamples = await executeQuery<{ ExampleText: string }>(`
        SELECT ExampleText FROM IdiomUsageExamples 
        WHERE IdiomID = @idiomId
      `, { idiomId: idiom.id });
      
      idiom.usageExamples = usageExamples.map(ex => ex.ExampleText);
    }
    
    return idioms;
  } catch (error) {
    console.error(`Error searching idioms for culture ID ${cultureId}:`, error);
    throw error;
  }
};

// Get a specific idiom by ID
export const getIdiomById = async (idiomId: string): Promise<Idiom | null> => {
  try {
    const idioms = await executeQuery<Idiom>(`
      SELECT 
        IdiomID as id, 
        CultureID as cultureId, 
        Language as language, 
        Phrase as phrase, 
        LiteralTranslation as literalTranslation, 
        Meaning as meaning, 
        ContextNotes as contextNotes, 
        PolitenessLevel as politenessLevel, 
        LastUpdated as lastUpdated 
      FROM Idioms 
      WHERE IdiomID = @idiomId
    `, { idiomId });
    
    if (idioms.length === 0) return null;
    
    const idiom = idioms[0];
    
    // Get usage examples
    const usageExamples = await executeQuery<{ ExampleText: string }>(`
      SELECT ExampleText FROM IdiomUsageExamples 
      WHERE IdiomID = @idiomId
    `, { idiomId });
    
    idiom.usageExamples = usageExamples.map(ex => ex.ExampleText);
    
    return idiom;
  } catch (error) {
    console.error(`Error fetching idiom with ID ${idiomId}:`, error);
    throw error;
  }
}; 