import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { getAllCultures } from '../services/cultureService';
import { Culture } from '../types/culture';
import { CulturalBriefingStackParamList } from '../types/navigation';
import { Ionicons } from '@expo/vector-icons';

type CultureSelectionScreenNavigationProp = StackNavigationProp<CulturalBriefingStackParamList, 'CultureSelection'>;

type Props = {
  navigation: CultureSelectionScreenNavigationProp;
};

// Flag colors for each culture
const cultureColors: { [key: string]: { primary: string; secondary: string } } = {
  'jp-001': { primary: '#BC002D', secondary: '#FFFFFF' }, // Japan
  'ar-001': { primary: '#006C35', secondary: '#FFFFFF' }, // Arabic/Gulf
  'br-001': { primary: '#009739', secondary: '#FFDF00' }, // Brazil
};

// Simple flag component instead of using images
const CultureFlag = ({ cultureId }: { cultureId: string }) => {
  const colors = cultureColors[cultureId] || { primary: '#4A6FA5', secondary: '#FFFFFF' };
  
  let flagContent;
  
  switch (cultureId) {
    case 'jp-001': // Japan
      flagContent = (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ 
            width: 30, 
            height: 30, 
            borderRadius: 15, 
            backgroundColor: colors.primary
          }} />
        </View>
      );
      break;
    case 'ar-001': // Arabic/Gulf
      flagContent = (
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1, backgroundColor: colors.primary }} />
          <View style={{ flex: 1, backgroundColor: '#FFFFFF' }} />
          <View style={{ flex: 1, backgroundColor: '#000000' }} />
        </View>
      );
      break;
    case 'br-001': // Brazil
      flagContent = (
        <View style={{ 
          flex: 1, 
          backgroundColor: colors.primary,
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <View style={{ 
            width: 35, 
            height: 20, 
            backgroundColor: colors.secondary,
            transform: [{ rotate: '45deg' }]
          }} />
        </View>
      );
      break;
    default:
      flagContent = (
        <View style={{ 
          flex: 1, 
          justifyContent: 'center', 
          alignItems: 'center',
          backgroundColor: colors.primary
        }}>
          <Text style={{ 
            color: colors.secondary, 
            fontWeight: 'bold', 
            fontSize: 22
          }}>
            {cultureId.substring(0, 2).toUpperCase()}
          </Text>
        </View>
      );
  }
  
  return (
    <View style={styles.flagContainer}>
      {flagContent}
    </View>
  );
};

const CultureSelectionScreen: React.FC<Props> = ({ navigation }) => {
  const [cultures, setCultures] = useState<Culture[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCultures = async () => {
      try {
        setIsLoading(true);
        const data = await getAllCultures();
        setCultures(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching cultures:', err);
        setError('Failed to load cultures. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCultures();
  }, []);

  const handleCultureSelect = (culture: Culture) => {
    navigation.navigate('CulturalBriefingDetail', { cultureId: culture.id });
  };

  const renderCultureItem = ({ item }: { item: Culture }) => (
    <TouchableOpacity 
      style={styles.cultureCard}
      onPress={() => handleCultureSelect(item)}
    >
      <CultureFlag cultureId={item.id} />
      <View style={styles.cultureInfo}>
        <Text style={styles.cultureName}>{item.name}</Text>
        <Text style={styles.cultureRegion}>{item.region}</Text>
        <Text style={styles.cultureDescription} numberOfLines={2}>
          {item.description}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#4A6FA5" />
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4A6FA5" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => navigation.navigate('CultureSelection')}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Select a Culture</Text>
        <Text style={styles.subtitle}>
          Choose a culture to explore its customs, norms, and etiquette
        </Text>
      </View>
      
      <FlatList
        data={cultures}
        renderItem={renderCultureItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  listContainer: {
    padding: 16,
  },
  cultureCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  flagContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    marginRight: 16,
  },
  cultureInfo: {
    flex: 1,
  },
  cultureName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  cultureRegion: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  cultureDescription: {
    fontSize: 14,
    color: '#666',
  },
  separator: {
    height: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#ff6b6b',
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#4A6FA5',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CultureSelectionScreen; 