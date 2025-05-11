import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ImageAnalysisPlaceholderScreen: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.featureComingSoon}>
        <Ionicons name="image-outline" size={80} color="#4A6FA5" style={styles.icon} />
        <Text style={styles.title}>Image Analysis</Text>
        <Text style={styles.subtitle}>Coming Soon</Text>
        <Text style={styles.description}>
          In a future update, you'll be able to analyze images for cultural context and significance.
        </Text>
        
        <TouchableOpacity 
          style={styles.infoButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.infoButtonText}>Learn More</Text>
        </TouchableOpacity>
      </View>

      {/* Modal with more detailed information about the upcoming feature */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>Image Analysis Feature</Text>
              
              <View style={styles.featureDescription}>
                <Ionicons name="scan-outline" size={24} color="#4A6FA5" />
                <Text style={styles.featureText}>
                  Scan objects, gestures, and symbols to understand their cultural significance.
                </Text>
              </View>
              
              <View style={styles.featureDescription}>
                <Ionicons name="alert-circle-outline" size={24} color="#4A6FA5" />
                <Text style={styles.featureText}>
                  Get alerts about potentially inappropriate or sensitive imagery in different cultural contexts.
                </Text>
              </View>
              
              <View style={styles.featureDescription}>
                <Ionicons name="book-outline" size={24} color="#4A6FA5" />
                <Text style={styles.featureText}>
                  Learn about cultural artifacts, traditional dress, and important symbols.
                </Text>
              </View>
              
              <View style={styles.featureDescription}>
                <Ionicons name="restaurant-outline" size={24} color="#4A6FA5" />
                <Text style={styles.featureText}>
                  Identify foods and dining customs from different cultures.
                </Text>
              </View>
              
              {/* Placeholder image visualization */}
              <View style={styles.placeholderImage}>
                <Ionicons name="camera" size={48} color="#4A6FA5" style={{opacity: 0.5}} />
                <Text style={styles.placeholderImageText}>Image Analysis Preview</Text>
              </View>
              
              <Text style={styles.disclaimer}>
                This feature is currently in development. We're working on making cross-cultural
                image recognition accurate, respectful, and helpful for your travels and interactions.
              </Text>
              
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    padding: 16,
  },
  featureComingSoon: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  icon: {
    marginBottom: 20,
    opacity: 0.8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4A6FA5',
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    color: '#4A5568',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  infoButton: {
    backgroundColor: '#4A6FA5',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  infoButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 24,
    textAlign: 'center',
  },
  featureDescription: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  featureText: {
    fontSize: 16,
    color: '#4A5568',
    marginLeft: 12,
    flex: 1,
    lineHeight: 22,
  },
  placeholderImage: {
    width: '100%',
    height: 200,
    marginVertical: 20,
    borderRadius: 8,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderImageText: {
    fontSize: 16,
    color: '#4A5568',
    marginTop: 10,
  },
  disclaimer: {
    fontSize: 14,
    color: '#718096',
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 20,
    lineHeight: 20,
  },
  closeButton: {
    backgroundColor: '#E2E8F0',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: 10,
  },
  closeButtonText: {
    color: '#4A5568',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ImageAnalysisPlaceholderScreen; 