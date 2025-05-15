/**
 * Types for Cultural Nuance Navigator based on CultureBank schema
 */

/**
 * Represents a cultural norm or behavior
 */
export interface CulturalNorm {
  // Core identification
  clusterId: number;
  culturalGroup: string;
  
  // Context and relationships
  context: string;
  goal: string;
  relation: string;
  
  // Actors and behaviors
  actor: string;
  actorBehavior: string;
  recipient: string;
  recipientBehavior: string;
  
  // Additional information
  otherDescriptions: string;
  topic: string;
  
  // Metadata
  agreement: number; // 0-1 score indicating consensus
  numSupportBin: string; // e.g., "[1, 5)", "[5, 20)"
  timeRange: Record<string, string>; // e.g., {"2022": "[10, 20)"}
}

/**
 * Cultural topics as defined in CultureBank
 */
export enum CulturalTopic {
  FOOD_AND_DINING = 'Food and Dining',
  SOCIAL_NORMS = 'Social Norms and Etiquette',
  // Add other topics from CultureBank's CULTURAL_TOPICS list
  // TODO: Update with complete list from CultureBank's constants.py
}

/**
 * User preferences for the app
 */
export interface UserPreferences {
  selectedCulture: string | null;
  favoriteNorms: number[]; // Array of cluster IDs
  lastViewedNorms: number[]; // Array of recently viewed cluster IDs
  preferredTopics: CulturalTopic[];
} 