import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserPreferences, CulturalTopic } from '../types/culture';

const PREFERENCES_KEY = '@culturalai:preferences';

class PreferencesService {
  private preferences: UserPreferences = {
    selectedCulture: null,
    favoriteNorms: [],
    lastViewedNorms: [],
    preferredTopics: []
  };

  async loadPreferences(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(PREFERENCES_KEY);
      if (stored) {
        this.preferences = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  }

  private async savePreferences(): Promise<void> {
    try {
      await AsyncStorage.setItem(PREFERENCES_KEY, JSON.stringify(this.preferences));
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  }

  async setSelectedCulture(culture: string | null): Promise<void> {
    this.preferences.selectedCulture = culture;
    await this.savePreferences();
  }

  getSelectedCulture(): string | null {
    return this.preferences.selectedCulture;
  }

  async addFavoriteNorm(clusterId: number): Promise<void> {
    if (!this.preferences.favoriteNorms.includes(clusterId)) {
      this.preferences.favoriteNorms.push(clusterId);
      await this.savePreferences();
    }
  }

  async removeFavoriteNorm(clusterId: number): Promise<void> {
    this.preferences.favoriteNorms = this.preferences.favoriteNorms.filter(
      id => id !== clusterId
    );
    await this.savePreferences();
  }

  getFavoriteNorms(): number[] {
    return [...this.preferences.favoriteNorms];
  }

  async addRecentlyViewed(clusterId: number): Promise<void> {
    // Remove if already exists
    this.preferences.lastViewedNorms = this.preferences.lastViewedNorms.filter(
      id => id !== clusterId
    );
    
    // Add to front of array
    this.preferences.lastViewedNorms.unshift(clusterId);
    
    // Keep only last 20 items
    this.preferences.lastViewedNorms = this.preferences.lastViewedNorms.slice(0, 20);
    
    await this.savePreferences();
  }

  getRecentlyViewed(): number[] {
    return [...this.preferences.lastViewedNorms];
  }

  async setPreferredTopics(topics: CulturalTopic[]): Promise<void> {
    this.preferences.preferredTopics = topics;
    await this.savePreferences();
  }

  getPreferredTopics(): CulturalTopic[] {
    return [...this.preferences.preferredTopics];
  }
}

export const preferencesService = new PreferencesService(); 