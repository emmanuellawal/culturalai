import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  SectionList,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { getCulturalBriefing } from '../services/cultureService';
import { CulturalBriefing, CulturalNorm, NormCategory } from '../types/culture';
import { CulturalBriefingStackParamList } from '../types/navigation';
import DisclaimerBanner from '../components/DisclaimerBanner';
import FeedbackButton from '../components/FeedbackButton';

type CulturalBriefingDetailScreenRouteProp = RouteProp<CulturalBriefingStackParamList, 'CulturalBriefingDetail'>;
type CulturalBriefingDetailScreenNavigationProp = StackNavigationProp<CulturalBriefingStackParamList, 'CulturalBriefingDetail'>;

type Props = {
  route: CulturalBriefingDetailScreenRouteProp;
  navigation: CulturalBriefingDetailScreenNavigationProp;
};

// Group norms by category
interface NormSection {
  title: string;
  data: CulturalNorm[];
}

// Flag colors for each culture (same as in CultureSelectionScreen)
const cultureColors: { [key: string]: { primary: string; secondary: string } } = {
  'jp-001': { primary: '#BC002D', secondary: '#FFFFFF' }, // Japan
  'ar-001': { primary: '#006C35', secondary: '#FFFFFF' }, // Arabic/Gulf
  'br-001': { primary: '#009739', secondary: '#FFDF00' }, // Brazil
};

// Simple flag component (same as in CultureSelectionScreen)
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

const CulturalBriefingDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { cultureId } = route.params;
  const [briefing, setBriefing] = useState<CulturalBriefing | null>(null);
  const [sections, setSections] = useState<NormSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  useEffect(() => {
    const fetchBriefing = async () => {
      try {
        setIsLoading(true);
        const data = await getCulturalBriefing(cultureId);
        setBriefing(data);
        
        if (data) {
          // Group norms by category
          const normsByCategory = data.norms.reduce((acc: { [key: string]: CulturalNorm[] }, norm) => {
            const categoryName = norm.category;
            if (!acc[categoryName]) {
              acc[categoryName] = [];
            }
            acc[categoryName].push(norm);
            return acc;
          }, {});
          
          // Convert to sections array
          const normSections = Object.entries(normsByCategory).map(([title, data]) => ({
            title,
            data,
          }));
          
          setSections(normSections);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching cultural briefing:', err);
        setError('Failed to load cultural briefing. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBriefing();
  }, [cultureId]);

  const handleSaveOffline = () => {
    // Placeholder functionality - just show an alert
    Alert.alert(
      "Feature Coming Soon",
      "Offline access will be available in a future update.",
      [{ text: "OK" }]
    );
  };

  const handleSetReminder = (norm: CulturalNorm) => {
    // Placeholder functionality - just show an alert
    Alert.alert(
      "Feature Coming Soon",
      `Reminders for "${norm.subCategory || norm.category}" will be available in a future update.`,
      [{ text: "OK" }]
    );
  };

  const renderSectionHeader = ({ section: { title } }: { section: NormSection }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  const renderNormItem = ({ item }: { item: CulturalNorm }) => (
    <View style={styles.normCard}>
      {item.subCategory && (
        <Text style={styles.normSubCategory}>{item.subCategory}</Text>
      )}
      <Text style={styles.normDescription}>{item.description}</Text>
      
      <View style={styles.normContent}>
        <View style={styles.doSection}>
          <View style={styles.doIconContainer}>
            <Ionicons name="checkmark-circle" size={24} color="#4caf50" />
          </View>
          <Text style={styles.doHeading}>Do</Text>
          <Text style={styles.doBehavior}>{item.doBehavior}</Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.dontSection}>
          <View style={styles.dontIconContainer}>
            <Ionicons name="close-circle" size={24} color="#f44336" />
          </View>
          <Text style={styles.dontHeading}>Don't</Text>
          <Text style={styles.dontBehavior}>{item.dontBehavior}</Text>
        </View>
      </View>
      
      <View style={styles.explanationSection}>
        <Text style={styles.explanationHeading}>Why it matters</Text>
        <Text style={styles.explanation}>{item.explanation}</Text>
      </View>
      
      <View style={styles.normActionRow}>
        <View style={styles.severityContainer}>
          <Text style={styles.severityLabel}>Importance: </Text>
          <Text style={[
            styles.severityValue,
            item.severityLevel === 'Critical' && styles.criticalSeverity,
            item.severityLevel === 'High' && styles.highSeverity,
            item.severityLevel === 'Medium' && styles.mediumSeverity,
            item.severityLevel === 'Low' && styles.lowSeverity,
          ]}>
            {item.severityLevel}
          </Text>
        </View>
        
        <TouchableOpacity
          style={styles.reminderButton}
          onPress={() => handleSetReminder(item)}
        >
          <Ionicons name="notifications-outline" size={16} color="#4A6FA5" />
          <Text style={styles.reminderButtonText}>Set Reminder</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4A6FA5" />
      </View>
    );
  }

  if (error || !briefing) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error || 'Culture not found'}</Text>
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
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#4A6FA5" />
        </TouchableOpacity>
        
        <View style={styles.headerContainer}>
          <View style={styles.cultureInfoContainer}>
            <CultureFlag cultureId={cultureId} />
            <View style={styles.cultureTextContainer}>
              <Text style={styles.cultureName}>{briefing.cultureInfo.name}</Text>
              <Text style={styles.cultureRegion}>{briefing.cultureInfo.region}</Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={handleSaveOffline}
          >
            <Ionicons name="download-outline" size={18} color="#4A6FA5" />
            <Text style={styles.saveButtonText}>Save Offline</Text>
          </TouchableOpacity>
        </View>
        
        {showDisclaimer && (
          <DisclaimerBanner 
            type="cultural" 
            onClose={() => setShowDisclaimer(false)}
          />
        )}
        
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionTitle}>About {briefing.cultureInfo.name} Culture</Text>
          <Text style={styles.descriptionText}>{briefing.cultureInfo.description}</Text>
        </View>
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.briefingTitle}>Cultural Norms & Etiquette</Text>
        
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          renderItem={renderNormItem}
          renderSectionHeader={renderSectionHeader}
          stickySectionHeadersEnabled={true}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
          SectionSeparatorComponent={() => <View style={styles.sectionSeparator} />}
          ListFooterComponent={() => (
            <View style={styles.footerContainer}>
              <Text style={styles.lastUpdatedText}>
                Last Updated: {new Date(briefing.lastUpdated).toLocaleDateString()}
              </Text>
              
              <View style={styles.feedbackButtonContainer}>
                <FeedbackButton 
                  cultureId={cultureId}
                  analysisType="cultural_briefing"
                  compact={true}
                />
              </View>
            </View>
          )}
        />
      </View>
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
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    marginBottom: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cultureInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cultureTextContainer: {
    flex: 1,
  },
  cultureName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  cultureRegion: {
    fontSize: 16,
    color: '#666',
    marginBottom: 2,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f4f8',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#d0e1f9',
  },
  saveButtonText: {
    color: '#4A6FA5',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  descriptionContainer: {
    marginBottom: 12,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  contentContainer: {
    flex: 1,
  },
  briefingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 16,
    marginHorizontal: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  sectionHeader: {
    backgroundColor: '#4A6FA5',
    padding: 10,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    marginHorizontal: 16,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  normCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 16,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  normSubCategory: {
    fontSize: 15,
    fontWeight: '600',
    color: '#4A6FA5',
    marginBottom: 4,
  },
  normDescription: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  normContent: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  doSection: {
    flex: 1,
    marginRight: 8,
  },
  doIconContainer: {
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  doHeading: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4caf50',
    marginBottom: 4,
  },
  doBehavior: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  divider: {
    width: 1,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 8,
  },
  dontSection: {
    flex: 1,
    marginLeft: 8,
  },
  dontIconContainer: {
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  dontHeading: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#f44336',
    marginBottom: 4,
  },
  dontBehavior: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  explanationSection: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 12,
    marginBottom: 12,
  },
  explanationHeading: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 6,
  },
  explanation: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  severityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  severityLabel: {
    fontSize: 12,
    color: '#777',
  },
  severityValue: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  criticalSeverity: {
    color: '#d32f2f',
  },
  highSeverity: {
    color: '#f57c00',
  },
  mediumSeverity: {
    color: '#0288d1',
  },
  lowSeverity: {
    color: '#388e3c',
  },
  itemSeparator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 16,
  },
  sectionSeparator: {
    height: 20,
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
  footerContainer: {
    padding: 16,
    marginTop: 8,
  },
  lastUpdatedText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 16,
  },
  feedbackButtonContainer: {
    marginBottom: 16,
    alignItems: 'flex-end',
  },
});

export default CulturalBriefingDetailScreen; 