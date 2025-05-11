import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  FlatList, 
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { IdiomsStackParamList } from '../types/navigation';
import { Culture, Idiom } from '../types/culture';
import { fetchCultures, searchIdiomsByCulture } from '../services/cultureService';

type IdiomSearchScreenNavigationProp = StackNavigationProp<IdiomsStackParamList, 'IdiomSearch'>;

interface Props {
  navigation: IdiomSearchScreenNavigationProp;
}

const IdiomSearchScreen: React.FC<Props> = ({ navigation }) => {
  const [cultures, setCultures] = useState<Culture[]>([]);
  const [selectedCultureId, setSelectedCultureId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [idioms, setIdioms] = useState<Idiom[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  // Fetch available cultures when component mounts
  useEffect(() => {
    const loadCultures = async () => {
      try {
        const availableCultures = await fetchCultures();
        setCultures(availableCultures);
        
        // Set the first culture as selected by default if any exist
        if (availableCultures.length > 0) {
          setSelectedCultureId(availableCultures[0].id);
        }
      } catch (error) {
        console.error('Failed to load cultures:', error);
        Alert.alert('Error', 'Failed to load available cultures. Please try again later.');
      }
    };

    loadCultures();
  }, []);

  const handleSearch = async () => {
    if (!selectedCultureId) {
      Alert.alert('Selection Required', 'Please select a culture first.');
      return;
    }

    setLoading(true);
    setHasSearched(true);

    try {
      const results = await searchIdiomsByCulture(selectedCultureId, searchQuery);
      setIdioms(results);
    } catch (error) {
      console.error('Failed to search idioms:', error);
      Alert.alert('Error', 'Failed to search for idioms. Please try again later.');
      setIdioms([]);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: Idiom }) => (
    <TouchableOpacity 
      style={styles.idiomItem}
      onPress={() => navigation.navigate('IdiomDetail', { 
        idiomId: item.id,
        idiomPhrase: item.phrase 
      })}
    >
      <View style={styles.idiomItemContent}>
        <Text style={styles.idiomPhrase}>{item.phrase}</Text>
        <Text style={styles.idiomMeaning} numberOfLines={2}>{item.meaning}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#4A6FA5" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Search for Idioms</Text>
      
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Select Culture:</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedCultureId}
            onValueChange={(itemValue) => setSelectedCultureId(itemValue)}
            style={styles.picker}
          >
            {cultures.map((culture) => (
              <Picker.Item 
                key={culture.id} 
                label={culture.name} 
                value={culture.id} 
              />
            ))}
          </Picker>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for idioms (optional)"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity 
          style={styles.searchButton}
          onPress={handleSearch}
        >
          <Ionicons name="search" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4A6FA5" />
          <Text style={styles.loadingText}>Searching for idioms...</Text>
        </View>
      ) : hasSearched ? (
        idioms.length > 0 ? (
          <FlatList
            data={idioms}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            ListHeaderComponent={
              <Text style={styles.resultsText}>
                Found {idioms.length} idiom{idioms.length !== 1 ? 's' : ''}
              </Text>
            }
          />
        ) : (
          <View style={styles.noResultsContainer}>
            <Ionicons name="search-outline" size={48} color="#aaa" />
            <Text style={styles.noResultsText}>No idioms found</Text>
            <Text style={styles.noResultsSubtext}>
              Try different search terms or browse all idioms by leaving the search field empty.
            </Text>
          </View>
        )
      ) : (
        <View style={styles.initialStateContainer}>
          <Ionicons name="chatbubble-ellipses-outline" size={64} color="#4A6FA5" opacity={0.5} />
          <Text style={styles.initialStateText}>
            Select a culture and search to discover idioms and their meanings
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F7FA',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#2D3748',
  },
  pickerContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#4A5568',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#CBD5E0',
    borderRadius: 8,
    backgroundColor: 'white',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  searchInput: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: '#CBD5E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    fontSize: 16,
  },
  searchButton: {
    width: 50,
    height: 50,
    backgroundColor: '#4A6FA5',
    borderRadius: 8,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#4A5568',
  },
  listContainer: {
    paddingBottom: 16,
  },
  resultsText: {
    fontSize: 16,
    marginBottom: 16,
    color: '#4A5568',
  },
  idiomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4A6FA5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  idiomItemContent: {
    flex: 1,
    marginRight: 8,
  },
  idiomPhrase: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 4,
  },
  idiomMeaning: {
    fontSize: 14,
    color: '#4A5568',
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A5568',
    marginTop: 16,
    marginBottom: 8,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
  },
  initialStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  initialStateText: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
    marginTop: 16,
  },
});

export default IdiomSearchScreen; 