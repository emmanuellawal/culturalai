import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type DisclaimerBannerProps = {
  type?: 'cultural' | 'ai' | 'general';
  compact?: boolean;
  onClose?: () => void;
};

/**
 * A component to display important disclaimers about cultural nuances and AI limitations
 * to help minimize bias and stereotyping in the application.
 */
const DisclaimerBanner: React.FC<DisclaimerBannerProps> = ({ 
  type = 'cultural',
  compact = false,
  onClose
}) => {
  // Select disclaimer message based on type
  let message = '';
  
  switch (type) {
    case 'cultural':
      message = 'Cultural norms are general tendencies, not absolute rules. Individuals vary widely within cultures, and these insights should be used as general guidance, not stereotypes.';
      break;
    case 'ai':
      message = 'AI analysis is imperfect and may contain biases. Please use your judgment and consider context when applying these suggestions.';
      break;
    case 'general':
    default:
      message = 'This information is provided as general guidance only. Individual experiences and contexts may vary significantly.';
  }

  if (compact) {
    // Shorter version for compact mode
    message = type === 'cultural' 
      ? 'Cultural norms are general tendencies, not absolute rules for individuals.'
      : type === 'ai'
        ? 'AI analysis may contain biases. Use your judgment.'
        : 'For general guidance only. Individual contexts may vary.';
  }

  return (
    <View style={[
      styles.container,
      type === 'cultural' ? styles.culturalContainer : 
      type === 'ai' ? styles.aiContainer : styles.generalContainer,
      compact && styles.compactContainer
    ]}>
      <View style={styles.iconContainer}>
        <Ionicons 
          name={
            type === 'cultural' ? 'information-circle' : 
            type === 'ai' ? 'alert-circle' : 'help-circle'
          } 
          size={compact ? 16 : 20} 
          color="#fff" 
        />
      </View>
      
      <Text style={[
        styles.message,
        compact && styles.compactMessage
      ]}>
        {message}
      </Text>
      
      {onClose && (
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={compact ? 16 : 20} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  culturalContainer: {
    backgroundColor: '#4A6FA5', // Blue for cultural disclaimers
  },
  aiContainer: {
    backgroundColor: '#9C5A9B', // Purple for AI disclaimers
  },
  generalContainer: {
    backgroundColor: '#5A9C7F', // Green for general disclaimers
  },
  compactContainer: {
    padding: 8,
    marginVertical: 4,
  },
  iconContainer: {
    marginRight: 10,
  },
  message: {
    color: '#fff',
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  compactMessage: {
    fontSize: 12,
    lineHeight: 16,
  },
  closeButton: {
    marginLeft: 10,
  },
});

export default DisclaimerBanner; 