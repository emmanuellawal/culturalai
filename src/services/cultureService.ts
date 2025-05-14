import { Culture, CulturalNorm, Idiom, CulturalBriefing, NormCategory, SeverityLevel, PolitenessLevel } from '../types/culture';
import axios from 'axios';
import { API_BASE_URL } from '../utils/config';
import { getToken } from './authService';

// Get all available cultures
export const getAllCultures = async (): Promise<Culture[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/cultures`);
    return response.data;
  } catch (error) {
    console.error('Error fetching cultures:', error);
    throw error;
  }
};

// Get a specific culture by ID
export const getCultureById = async (cultureId: string): Promise<Culture | null> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/cultures/${cultureId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    console.error(`Error fetching culture with ID ${cultureId}:`, error);
    throw error;
  }
};

// Get all cultural norms for a specific culture
export const getNormsByCultureId = async (cultureId: string): Promise<CulturalNorm[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/norms?cultureId=${cultureId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching norms for culture ID ${cultureId}:`, error);
    throw error;
  }
};

// Get cultural norms by category for a specific culture
export const getNormsByCategory = async (cultureId: string, category: NormCategory): Promise<CulturalNorm[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/norms?cultureId=${cultureId}&category=${category}`);
    return response.data;
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
    let url = `${API_BASE_URL}/api/idioms?cultureId=${cultureId}`;
    if (query && query.trim() !== '') {
      url += `&query=${encodeURIComponent(query)}`;
    }
    
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(`Error searching idioms for culture ID ${cultureId}:`, error);
    throw error;
  }
};

// Get a specific idiom by ID
export const getIdiomById = async (idiomId: string): Promise<Idiom | null> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/idioms/${idiomId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    console.error(`Error fetching idiom with ID ${idiomId}:`, error);
    throw error;
  }
}; 