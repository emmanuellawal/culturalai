export interface Culture {
  id: string;
  name: string;
  region: string;
  primaryLanguage: string;
  description: string;
  lastUpdated: string;
}

export interface CulturalNorm {
  id: string;
  cultureId: string;
  category: NormCategory;
  subCategory?: string;
  description: string;
  doBehavior: string;
  dontBehavior: string;
  explanation: string;
  severityLevel: SeverityLevel;
  lastUpdated: string;
}

export interface Idiom {
  id: string;
  cultureId: string;
  language: string;
  phrase: string;
  literalTranslation: string;
  meaning: string;
  usageExamples: string[];
  contextNotes?: string;
  politenessLevel: PolitenessLevel;
  lastUpdated: string;
}

export enum NormCategory {
  Greeting = 'Greeting',
  Dining = 'Dining',
  Business = 'Business',
  Gesture = 'Gesture',
  SensitiveTopic = 'SensitiveTopic',
  Communication = 'Communication',
  General = 'General'
}

export enum SeverityLevel {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Critical = 'Critical'
}

export type PolitenessLevel = 'formal' | 'informal' | 'slang' | 'vulgar';

export interface CulturalBriefing {
  cultureInfo: Culture;
  norms: CulturalNorm[];
} 