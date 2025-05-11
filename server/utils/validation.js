/**
 * Validation utilities for Cultural Knowledge Base (CKB) data inputs
 * Contains validation rules for all CKB entities
 */

// Validation rules for Culture entity
const validateCulture = (culture) => {
  const errors = [];
  
  // Required fields
  if (!culture.CultureName || culture.CultureName.trim() === '') {
    errors.push('Culture name is required');
  } else if (culture.CultureName.length > 100) {
    errors.push('Culture name must be 100 characters or less');
  }
  
  if (!culture.Region || culture.Region.trim() === '') {
    errors.push('Region is required');
  } else if (culture.Region.length > 100) {
    errors.push('Region must be 100 characters or less');
  }
  
  if (!culture.PrimaryLanguage || culture.PrimaryLanguage.trim() === '') {
    errors.push('Primary language is required');
  } else if (culture.PrimaryLanguage.length > 100) {
    errors.push('Primary language must be 100 characters or less');
  }
  
  if (!culture.Description || culture.Description.trim() === '') {
    errors.push('Description is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Validation rules for CulturalNorm entity
const validateCulturalNorm = (norm) => {
  const errors = [];
  
  // Required fields
  if (!norm.CultureID || norm.CultureID.trim() === '') {
    errors.push('Culture ID is required');
  }
  
  if (!norm.Category || norm.Category.trim() === '') {
    errors.push('Category is required');
  } else if (norm.Category.length > 50) {
    errors.push('Category must be 50 characters or less');
  }
  
  // SubCategory is optional but has length constraint
  if (norm.SubCategory && norm.SubCategory.length > 100) {
    errors.push('SubCategory must be 100 characters or less');
  }
  
  if (!norm.Description || norm.Description.trim() === '') {
    errors.push('Description is required');
  }
  
  if (!norm.DoBehavior || norm.DoBehavior.trim() === '') {
    errors.push('Do behavior is required');
  }
  
  if (!norm.DontBehavior || norm.DontBehavior.trim() === '') {
    errors.push('Don\'t behavior is required');
  }
  
  if (!norm.Explanation || norm.Explanation.trim() === '') {
    errors.push('Explanation is required');
  }
  
  if (!norm.SeverityLevel || norm.SeverityLevel.trim() === '') {
    errors.push('Severity level is required');
  } else if (!['Low', 'Medium', 'High'].includes(norm.SeverityLevel)) {
    errors.push('Severity level must be one of: Low, Medium, High');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Validation rules for Idiom entity
const validateIdiom = (idiom) => {
  const errors = [];
  
  // Required fields
  if (!idiom.CultureID || idiom.CultureID.trim() === '') {
    errors.push('Culture ID is required');
  }
  
  if (!idiom.Language || idiom.Language.trim() === '') {
    errors.push('Language is required');
  } else if (idiom.Language.length > 100) {
    errors.push('Language must be 100 characters or less');
  }
  
  if (!idiom.Phrase || idiom.Phrase.trim() === '') {
    errors.push('Phrase is required');
  }
  
  if (!idiom.LiteralTranslation || idiom.LiteralTranslation.trim() === '') {
    errors.push('Literal translation is required');
  }
  
  if (!idiom.Meaning || idiom.Meaning.trim() === '') {
    errors.push('Meaning is required');
  }
  
  if (!idiom.PolitenessLevel || idiom.PolitenessLevel.trim() === '') {
    errors.push('Politeness level is required');
  } else if (!['Informal', 'Neutral', 'Formal', 'Very Formal'].includes(idiom.PolitenessLevel)) {
    errors.push('Politeness level must be one of: Informal, Neutral, Formal, Very Formal');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Validation rules for Scenario entity
const validateScenario = (scenario) => {
  const errors = [];
  
  // Required fields
  if (!scenario.CultureID || scenario.CultureID.trim() === '') {
    errors.push('Culture ID is required');
  }
  
  if (!scenario.Category || scenario.Category.trim() === '') {
    errors.push('Category is required');
  } else if (scenario.Category.length > 100) {
    errors.push('Category must be 100 characters or less');
  }
  
  if (!scenario.Title || scenario.Title.trim() === '') {
    errors.push('Title is required');
  } else if (scenario.Title.length > 255) {
    errors.push('Title must be 255 characters or less');
  }
  
  if (!scenario.SituationDescription || scenario.SituationDescription.trim() === '') {
    errors.push('Situation description is required');
  }
  
  // ImageURL is optional but should be a valid URL if provided
  if (scenario.ImageURL && !isValidURL(scenario.ImageURL)) {
    errors.push('Image URL must be a valid URL');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Validation rules for ScenarioChoice entity
const validateScenarioChoice = (choice) => {
  const errors = [];
  
  // Required fields
  if (!choice.ScenarioID || choice.ScenarioID.trim() === '') {
    errors.push('Scenario ID is required');
  }
  
  if (!choice.ChoiceText || choice.ChoiceText.trim() === '') {
    errors.push('Choice text is required');
  }
  
  if (typeof choice.IsCorrectChoice !== 'boolean') {
    errors.push('IsCorrectChoice must be a boolean value');
  }
  
  if (!choice.FeedbackText || choice.FeedbackText.trim() === '') {
    errors.push('Feedback text is required');
  }
  
  if (!choice.ConsequenceDescription || choice.ConsequenceDescription.trim() === '') {
    errors.push('Consequence description is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Helper function to validate URLs
function isValidURL(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

module.exports = {
  validateCulture,
  validateCulturalNorm,
  validateIdiom,
  validateScenario,
  validateScenarioChoice
}; 