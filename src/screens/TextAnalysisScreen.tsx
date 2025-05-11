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

  const navigation = useNavigation();

  // Fetch available cultures when component mounts
  useEffect(() => {
    const fetchCultures = async () => {
      try {
        const culturesData = await getCultures();
        setCultures(culturesData);
        if (culturesData.length > 0) {
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
        
        {feedback.summary && (
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryTitle}>Summary</Text>
            <Text style={styles.summaryText}>{feedback.summary}</Text>
          </View>
        )}

        {feedback.issues && feedback.issues.length > 0 && (
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

        {feedback.alternatives && feedback.alternatives.length > 0 && (
          <View>
            <Text style={styles.alternativesTitle}>Suggested Alternatives</Text>
            {feedback.alternatives.map((alt: string, index: number) => (
              <Text key={index} style={styles.alternativeText}>• {alt}</Text>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Real-Time Text Analysis</Text>
        <Text style={styles.description}>
          Enter text and select a culture to receive AI-powered feedback on cultural nuances and potential misunderstandings.
        </Text>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Select Target Culture:</Text>
          <View style={styles.pickerContainer}>
            {cultures.length > 0 ? (
              <Picker
                selectedValue={selectedCultureId}
                style={styles.picker}
                onValueChange={(itemValue) => setSelectedCultureId(itemValue as string)}
              >
                {cultures.map((culture) => (
                  <Picker.Item 
                    key={culture.id} 
                    label={culture.name} 
                    value={culture.id} 
                  />
                ))}
              </Picker>
            ) : (
              <Text style={styles.pickerPlaceholder}>Loading cultures...</Text>
            )}
          </View>

          <Text style={styles.label}>Text Type:</Text>
          <View style={styles.radioContainer}>
            <View style={styles.radioOption}>
              <RadioButton
                value="myText"
                status={isMyText ? 'checked' : 'unchecked'}
                onPress={() => setIsMyText(true)}
                color="#4A6FA5"
              />
              <Text onPress={() => setIsMyText(true)}>My Text (For my writing)</Text>
            </View>
            <View style={styles.radioOption}>
              <RadioButton
                value="theirText"
                status={!isMyText ? 'checked' : 'unchecked'}
                onPress={() => setIsMyText(false)}
                color="#4A6FA5"
              />
              <Text onPress={() => setIsMyText(false)}>Their Text (For interpretation)</Text>
            </View>
          </View>

          <Text style={styles.label}>Enter Text:</Text>
          <TextInput
            style={styles.textInput}
            multiline
            placeholder="Type or paste the text you want to analyze..."
            value={text}
            onChangeText={setText}
            textAlignVertical="top"
          />

          <TouchableOpacity 
            style={styles.analyzeButton}
            onPress={handleAnalyzeText}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Analyze Text</Text>
            )}
          </TouchableOpacity>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {renderFeedback()}
      </View>

      {/* Consent Modal */}
      <ConsentModal
        visible={showConsentModal}
        onClose={() => setShowConsentModal(false)}
        onAccept={handleConsentAccepted}
        onDecline={handleConsentDeclined}
        title="Data Processing Consent"
        message={
          "Before we analyze your text, we need your permission to process it for cultural context analysis. " +
          "We prioritize your privacy: your text is only processed to provide you with cultural insights and is not permanently stored. " +
          "You can also choose to help us improve our AI models with anonymous data."
        }
        acceptButtonText="I Consent"
        declineButtonText="No Thanks"
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A6FA5',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#4D5156',
    marginBottom: 20,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4D5156',
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#E1E4E8',
    borderRadius: 4,
    marginBottom: 16,
  },
  picker: {
    height: 50,
  },
  pickerPlaceholder: {
    padding: 12,
    color: '#A0A5AA',
  },
  radioContainer: {
    flexDirection: 'column',
    marginBottom: 16,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E1E4E8',
    borderRadius: 4,
    padding: 12,
    height: 120,
    marginBottom: 16,
  },
  analyzeButton: {
    backgroundColor: '#4A6FA5',
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    backgroundColor: '#FEECEC',
    padding: 12,
    borderRadius: 4,
    marginBottom: 20,
  },
  errorText: {
    color: '#D93025',
  },
  feedbackContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  feedbackTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A6FA5',
    marginBottom: 16,
  },
  summaryContainer: {
    backgroundColor: '#F0F4F9',
    padding: 12,
    borderRadius: 4,
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  summaryText: {
    fontSize: 14,
    color: '#4D5156',
  },
  issuesTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  issueItem: {
    backgroundColor: '#FFF9E6',
    padding: 12,
    borderRadius: 4,
    marginBottom: 8,
  },
  issueType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E6A817',
    marginBottom: 4,
  },
  issueText: {
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 4,
  },
  issueExplanation: {
    fontSize: 14,
    color: '#4D5156',
    marginBottom: 4,
  },
  issueSuggestion: {
    fontSize: 14,
    color: '#4A6FA5',
    marginBottom: 4,
  },
  idiomButton: {
    backgroundColor: '#EAF1FB',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  idiomButtonText: {
    color: '#4A6FA5',
    fontSize: 14,
  },
  alternativesTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
  },
  alternativeText: {
    fontSize: 14,
    color: '#4D5156',
    marginBottom: 4,
  }
});

export default TextAnalysisScreen; 