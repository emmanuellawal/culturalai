import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  TextInput, 
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { submitFeedback } from '../services/feedbackService';

type FeedbackButtonProps = {
  analysisId?: string;
  analysisType?: string;
  cultureId?: string;
  compact?: boolean;
};

/**
 * A button that opens a feedback form for users to report issues with AI analysis
 */
const FeedbackButton: React.FC<FeedbackButtonProps> = ({ 
  analysisId, 
  analysisType = 'text',
  cultureId,
  compact = false
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [feedbackType, setFeedbackType] = useState<string>('');
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    // Reset form
    setFeedbackType('');
    setFeedbackText('');
  };

  const handleSubmit = async () => {
    if (!feedbackType) {
      Alert.alert('Error', 'Please select a feedback type');
      return;
    }

    if (!feedbackText.trim()) {
      Alert.alert('Error', 'Please provide details about the issue');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const result = await submitFeedback({
        analysisId,
        analysisType,
        cultureId,
        feedbackType,
        feedbackText,
        timestamp: new Date().toISOString()
      });
      
      setIsSubmitting(false);
      
      if (result.success) {
        Alert.alert(
          'Thank You',
          'Your feedback has been submitted. We appreciate your help in improving our AI.',
          [{ text: 'OK', onPress: handleCloseModal }]
        );
      } else {
        throw new Error(result.message || 'Failed to submit feedback');
      }
    } catch (error) {
      setIsSubmitting(false);
      Alert.alert(
        'Error',
        'Failed to submit feedback. Please try again later.',
        [{ text: 'OK' }]
      );
    }
  };

  const renderFeedbackTypeButton = (type: string, label: string, icon: string) => (
    <TouchableOpacity 
      style={[
        styles.feedbackTypeButton,
        feedbackType === type && styles.selectedFeedbackType
      ]}
      onPress={() => setFeedbackType(type)}
    >
      <Ionicons 
        name={icon as any} 
        size={18} 
        color={feedbackType === type ? '#fff' : '#4A6FA5'} 
      />
      <Text 
        style={[
          styles.feedbackTypeText,
          feedbackType === type && styles.selectedFeedbackTypeText
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <>
      <TouchableOpacity 
        style={[styles.button, compact && styles.compactButton]} 
        onPress={handleOpenModal}
      >
        <Ionicons name="flag-outline" size={compact ? 14 : 16} color="#4A6FA5" />
        <Text style={[styles.buttonText, compact && styles.compactButtonText]}>
          Report Issue
        </Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Report an Issue</Text>
              <TouchableOpacity onPress={handleCloseModal}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={styles.sectionTitle}>What type of issue are you reporting?</Text>
              
              <View style={styles.feedbackTypeContainer}>
                {renderFeedbackTypeButton('bias', 'Cultural Bias', 'alert-circle-outline')}
                {renderFeedbackTypeButton('inaccuracy', 'Inaccurate Information', 'information-circle-outline')}
                {renderFeedbackTypeButton('offensive', 'Offensive Content', 'warning-outline')}
                {renderFeedbackTypeButton('other', 'Other Issue', 'help-circle-outline')}
              </View>

              <Text style={styles.sectionTitle}>Please provide details:</Text>
              <TextInput
                style={styles.textInput}
                multiline
                numberOfLines={5}
                placeholder="Describe the issue you found..."
                value={feedbackText}
                onChangeText={setFeedbackText}
              />

              <Text style={styles.disclaimer}>
                Your feedback helps us improve our AI and reduce bias. Thank you for contributing to a more culturally nuanced experience.
              </Text>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={handleCloseModal}
                disabled={isSubmitting}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.submitButton} 
                onPress={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.submitButtonText}>Submit</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f4f8',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#dbe1e8',
  },
  compactButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 16,
  },
  buttonText: {
    color: '#4A6FA5',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  compactButtonText: {
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '100%',
    maxWidth: 500,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalBody: {
    padding: 16,
    maxHeight: 400,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    marginTop: 8,
  },
  feedbackTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  feedbackTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f4f8',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#dbe1e8',
  },
  selectedFeedbackType: {
    backgroundColor: '#4A6FA5',
    borderColor: '#4A6FA5',
  },
  feedbackTypeText: {
    color: '#4A6FA5',
    marginLeft: 6,
    fontSize: 14,
  },
  selectedFeedbackTypeText: {
    color: '#fff',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#dbe1e8',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  disclaimer: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 16,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#4A6FA5',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default FeedbackButton; 