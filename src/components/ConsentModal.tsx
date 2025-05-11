import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Switch
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ConsentModalProps {
  visible: boolean;
  onClose: () => void;
  onAccept: (aiImprovement: boolean) => void;
  onDecline: () => void;
  title: string;
  message: string;
  acceptButtonText?: string;
  declineButtonText?: string;
}

const ConsentModal: React.FC<ConsentModalProps> = ({
  visible,
  onClose,
  onAccept,
  onDecline,
  title,
  message,
  acceptButtonText = 'I Agree',
  declineButtonText = 'No Thanks'
}) => {
  const [aiImprovementConsent, setAiImprovementConsent] = useState(true);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.content}>
            <Text style={styles.message}>{message}</Text>
            
            <View style={styles.optionContainer}>
              <View style={styles.switchContainer}>
                <Text style={styles.optionText}>
                  Allow anonymous data to be used for improving our AI models
                </Text>
                <Switch
                  value={aiImprovementConsent}
                  onValueChange={setAiImprovementConsent}
                  trackColor={{ false: '#d0d0d0', true: '#81b0ff' }}
                  thumbColor={'#f4f3f4'}
                />
              </View>
              <Text style={styles.optionDescription}>
                This helps us improve our cultural understanding models. No personally identifiable information is used.
              </Text>
            </View>
          </ScrollView>
          
          <View style={styles.buttonsContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.declineButton]} 
              onPress={onDecline}
            >
              <Text style={styles.declineButtonText}>{declineButtonText}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.acceptButton]} 
              onPress={() => onAccept(aiImprovementConsent)}
            >
              <Text style={styles.acceptButtonText}>{acceptButtonText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A6FA5',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 16,
    maxHeight: 400,
  },
  message: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    lineHeight: 24,
  },
  optionContainer: {
    backgroundColor: '#f5f7fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  optionText: {
    fontSize: 15,
    color: '#333',
    flex: 1,
    paddingRight: 10,
  },
  optionDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    minWidth: 100,
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: '#4A6FA5',
    marginLeft: 12,
  },
  acceptButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  declineButton: {
    backgroundColor: '#f5f5f5',
  },
  declineButtonText: {
    color: '#666',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default ConsentModal; 