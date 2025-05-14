import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator,
  ScrollView,
  Alert
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { RadioButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { getCultures } from '../services/cultureService';
import { analyzeText } from '../services/analysisService';
import { Culture } from '../types/culture';
import ConsentModal from '../components/ConsentModal';
import DisclaimerBanner from '../components/DisclaimerBanner';
import FeedbackButton from '../components/FeedbackButton';
import { 
  getTextAnalysisConsent, 
  storeTextAnalysisConsent, 
  storeAIImprovementConsent 
} from '../utils/consentManager';

const TextAnalysisScreen = () => {
  const [text, setText] = useState('');
  const [cultures, setCultures] = useState<Culture[]>([]);
  const [selectedCultureId, setSelectedCultureId] = useState<string>('');
  const [isMyText, setIsMyText] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [hasCheckedConsent, setHasCheckedConsent] = useState(false);
  const [analysisId, setAnalysisId] = useState<string | undefined>(undefined);

  const navigation = useNavigation();

  // Fetch available cultures when component mounts
  useEffect(() => {
    const fetchCultures = async () => {
      try {
        const culturesData = await getCultures();
        setCultures(culturesData);
        if (culturesData && culturesData.length > 0) {
          setSelectedCultureId(culturesData[0].id);
        }
      } catch (error) {
        console.error('Failed to fetch cultures:', error);
        setError('Failed to load cultures. Please try again later.');
      }
    };

    fetchCultures();
  }, []);

  // Check if user has already given consent
  useEffect(() => {
    const checkConsent = async () => {
      const hasConsented = await getTextAnalysisConsent();
      setHasCheckedConsent(true);
      // If consent status is null (not set yet), we'll show the modal when they try to analyze
    };

    checkConsent();
  }, []);

  const handleAnalyzeText = async () => {
    if (!text.trim()) {
      Alert.alert('Error', 'Please enter some text to analyze');
      return;
    }

    if (!selectedCultureId) {
      Alert.alert('Error', 'Please select a culture for analysis');
      return;
    }

    // Check for consent before proceeding
    const hasConsented = await getTextAnalysisConsent();
    if (hasConsented === null) {
      // If consent hasn't been given yet, show the modal
      setShowConsentModal(true);
      return;
    } else if (hasConsented === false) {
      // If user explicitly declined consent before
      Alert.alert(
        'Consent Required', 
        'You need to provide consent for text analysis to use this feature. You can update your consent in the Settings > Privacy & Data section.',
        [{ text: 'OK' }]
      );
      return;
    }

    // If we get here, consent has been given, proceed with analysis
    performAnalysis();
  };

  const performAnalysis = async () => {
    setIsLoading(true);
    setError(null);
    setFeedback(null);

    try {
      const result = await analyzeText(text, selectedCultureId, isMyText);
      setFeedback(result);
      // Generate a simple analysis ID for feedback purposes
      setAnalysisId(`text-${Date.now()}`);
    } catch (error) {
      console.error('Text analysis error:', error);
      setError('Failed to analyze text. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConsentAccepted = async (aiImprovementConsent: boolean) => {
    // Store both consent values
    await storeTextAnalysisConsent(true);
    await storeAIImprovementConsent(aiImprovementConsent);
    
    setShowConsentModal(false);
    
    // Now proceed with the analysis
    performAnalysis();
  };

  const handleConsentDeclined = async () => {
    // Store explicit decline
    await storeTextAnalysisConsent(false);
    await storeAIImprovementConsent(false);
    
    setShowConsentModal(false);
    
    Alert.alert(
      'Consent Declined',
      'You cannot use the text analysis feature without providing consent. You can update your consent in the Settings > Privacy & Data section.',
      [{ text: 'OK' }]
    );
  };

  const renderFeedback = () => {
    if (!feedback) return null;

    return (
      <View style={styles.feedbackContainer}>
        <Text style={styles.feedbackTitle}>Analysis Results</Text>
        
        {/* Add disclaimer banner for AI analysis */}
        <DisclaimerBanner type="ai" />
        
        {feedback.summary && (
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryTitle}>Summary</Text>
            <Text style={styles.summaryText}>{feedback.summary}</Text>
          </View>
        )}

        {feedback.issues && Array.isArray(feedback.issues) && feedback.issues.length > 0 && (
          <View>
            <Text style={styles.issuesTitle}>Cultural Considerations</Text>
            {feedback.issues.map((issue: any, index: number) => (
              <View key={index} style={styles.issueItem}>
                <Text style={styles.issueType}>{issue.type}</Text>
                <Text style={styles.issueText}>{issue.text}</Text>
                <Text style={styles.issueExplanation}>{issue.explanation}</Text>
                {issue.suggestion && (
                  <Text style={styles.issueSuggestion}>
                    <Text style={{fontWeight: 'bold'}}>Suggestion: </Text>
                    {issue.suggestion}
                  </Text>
                )}
                {issue.idiomId && (
                  <TouchableOpacity 
                    style={styles.idiomButton}
                    onPress={() => {
                      // Navigate to idiom details screen
                      // This would be implemented when the Idiom Demystifier is ready
                      Alert.alert('Feature Coming Soon', 'Idiom details will be available in a future update');
                    }}
                  >
                    <Text style={styles.idiomButtonText}>View Idiom Details</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        )}

        {feedback.alternatives && Array.isArray(feedback.alternatives) && feedback.alternatives.length > 0 && (
          <View>
            <Text style={styles.alternativesTitle}>Suggested Alternatives</Text>
            {feedback.alternatives.map((alt: string, index: number) => (
              <Text key={index} style={styles.alternativeText}>• {alt}</Text>
            ))}
          </View>
        )}
        
        {/* Add cultural disclaimer */}
        <DisclaimerBanner type="cultural" />
        
        {/* Add feedback button */}
        <View style={styles.feedbackButtonContainer}>
          <FeedbackButton 
            analysisId={analysisId} 
            analysisType="text" 
            cultureId={selectedCultureId} 
          />
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Real-Time Text Analysis</Text>
        <Text style={styles.description}>
          Enter text to analyze for cultural nuances and receive feedback.
        </Text>
        
        {/* Add disclaimer banner at the top */}
        <DisclaimerBanner type="cultural" compact={true} />
        
        <View style={styles.formContainer}>
          <Text style={styles.label}>Select Culture:</Text>
          <View style={styles.pickerContainer}>
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

          <Text style={styles.label}>Text Origin:</Text>
          <View style={styles.radioContainer}>
            <View style={styles.radioOption}>
              <RadioButton
                value="mine"
                status={isMyText ? 'checked' : 'unchecked'}
                onPress={() => setIsMyText(true)}
                color="#4A6FA5"
              />
              <Text style={styles.radioLabel}>My Text (I'm writing it)</Text>
            </View>
            <View style={styles.radioOption}>
              <RadioButton
                value="theirs"
                status={!isMyText ? 'checked' : 'unchecked'}
                onPress={() => setIsMyText(false)}
                color="#4A6FA5"
              />
              <Text style={styles.radioLabel}>Their Text (I'm reading it)</Text>
            </View>
          </View>

          <Text style={styles.label}>Enter Text:</Text>
          <TextInput
            style={styles.textInput}
            multiline
            numberOfLines={6}
            placeholder="Type or paste text here..."
            value={text}
            onChangeText={setText}
          />

          <TouchableOpacity 
            style={styles.analyzeButton}
            onPress={handleAnalyzeText}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.analyzeButtonText}>Analyze Text</Text>
            )}
          </TouchableOpacity>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {renderFeedback()}

        <ConsentModal 
          visible={showConsentModal}
          onAccept={handleConsentAccepted}
          onDecline={handleConsentDeclined}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    marginBottom: 16,
  },
  picker: {
    height: 50,
  },
  radioContainer: {
    marginBottom: 16,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  radioLabel: {
    fontSize: 16,
    color: '#333',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  analyzeButton: {
    backgroundColor: '#4A6FA5',
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  analyzeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#c62828',
    fontSize: 16,
  },
  feedbackContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  feedbackTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  summaryContainer: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f0f4f8',
    borderRadius: 8,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 16,
    color: '#333',
  },
  issuesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  issueItem: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4A6FA5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  issueType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A6FA5',
    marginBottom: 4,
  },
  issueText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  issueExplanation: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  issueSuggestion: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  idiomButton: {
    backgroundColor: '#4A6FA5',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  idiomButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  alternativesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 12,
  },
  alternativeText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    paddingLeft: 8,
  },
  feedbackButtonContainer: {
    marginTop: 16,
    alignItems: 'flex-end',
  }
});

export default TextAnalysisScreen; 