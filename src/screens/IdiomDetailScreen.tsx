import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator, 
  Alert,
  TouchableOpacity
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { IdiomsStackParamList } from '../types/navigation';
import { Idiom, PolitenessLevel } from '../types/culture';
import { getIdiomById } from '../services/cultureService';

type IdiomDetailScreenNavigationProp = StackNavigationProp<IdiomsStackParamList, 'IdiomDetail'>;
type IdiomDetailScreenRouteProp = RouteProp<IdiomsStackParamList, 'IdiomDetail'>;

interface Props {
  navigation: IdiomDetailScreenNavigationProp;
  route: IdiomDetailScreenRouteProp;
}

const IdiomDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { idiomId } = route.params;
  const [idiom, setIdiom] = useState<Idiom | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIdiomDetails = async () => {
      try {
        const idiomDetails = await getIdiomById(idiomId);
        setIdiom(idiomDetails);
      } catch (error) {
        console.error('Failed to fetch idiom details:', error);
        setError('Failed to load idiom details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchIdiomDetails();
  }, [idiomId]);

  const getPolitenessColor = (level: PolitenessLevel) => {
    switch (level) {
      case 'formal':
        return '#4A6FA5'; // Blue
      case 'informal':
        return '#58A05F'; // Green
      case 'slang':
        return '#E67E22'; // Orange
      case 'vulgar':
        return '#E74C3C'; // Red
      default:
        return '#718096'; // Gray
    }
  };

  const getPolitenessLabel = (level: PolitenessLevel) => {
    switch (level) {
      case 'formal':
        return 'Formal';
      case 'informal':
        return 'Informal';
      case 'slang':
        return 'Slang';
      case 'vulgar':
        return 'Vulgar';
      default:
        return 'Unknown';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A6FA5" />
        <Text style={styles.loadingText}>Loading idiom details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={64} color="#E53E3E" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!idiom) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="help-circle-outline" size={64} color="#718096" />
        <Text style={styles.errorText}>Idiom not found</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.idiomPhrase}>{idiom.phrase}</Text>
        <View 
          style={[
            styles.politenessTag, 
            { backgroundColor: getPolitenessColor(idiom.politenessLevel) }
          ]}
        >
          <Text style={styles.politenessText}>
            {getPolitenessLabel(idiom.politenessLevel)}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Literal Translation</Text>
        <Text style={styles.sectionContent}>{idiom.literalTranslation}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Meaning</Text>
        <Text style={styles.sectionContent}>{idiom.meaning}</Text>
      </View>

      {idiom.usageExamples && idiom.usageExamples.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Usage Examples</Text>
          {idiom.usageExamples.map((example, index) => (
            <View key={index} style={styles.exampleItem}>
              <Ionicons name="chatbubble-outline" size={18} color="#4A6FA5" />
              <Text style={styles.exampleText}>{example}</Text>
            </View>
          ))}
        </View>
      )}

      {idiom.contextNotes && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Context Notes</Text>
          <Text style={styles.sectionContent}>{idiom.contextNotes}</Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.metaData}>
          Language: {idiom.language} • Last Updated: {new Date(idiom.lastUpdated).toLocaleDateString()}
        </Text>
      </View>

      {/* This is just a placeholder for the "Save this Idiom" button */}
      <TouchableOpacity style={styles.saveButton} disabled={true}>
        <Ionicons name="bookmark-outline" size={20} color="#FFFFFF" />
        <Text style={styles.saveButtonText}>Save this Idiom</Text>
      </TouchableOpacity>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#4A5568',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F5F7FA',
  },
  errorText: {
    fontSize: 18,
    color: '#4A5568',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  retryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#4A6FA5',
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  idiomPhrase: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 8,
  },
  politenessTag: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginTop: 4,
  },
  politenessText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  section: {
    backgroundColor: 'white',
    padding: 20,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 16,
    color: '#4A5568',
    lineHeight: 24,
  },
  exampleItem: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  exampleText: {
    fontSize: 16,
    color: '#4A5568',
    marginLeft: 8,
    flex: 1,
    lineHeight: 24,
  },
  metaData: {
    fontSize: 14,
    color: '#718096',
    fontStyle: 'italic',
  },
  saveButton: {
    flexDirection: 'row',
    backgroundColor: '#A0AEC0', // Gray color to indicate it's disabled
    marginHorizontal: 20,
    marginTop: 24,
    paddingVertical: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  bottomSpacer: {
    height: 40,
  },
});

export default IdiomDetailScreen; 