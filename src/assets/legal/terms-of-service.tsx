import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types/navigation';

type TermsOfServiceScreenNavigationProp = StackNavigationProp<RootStackParamList, 'TermsOfService'>;

type Props = {
  navigation: TermsOfServiceScreenNavigationProp;
};

const TermsOfServiceScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms of Service</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView style={styles.content}>
        <Text style={styles.lastUpdated}>Last Updated: {new Date().toLocaleDateString()}</Text>
        
        <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
        <Text style={styles.paragraph}>
          By accessing or using the Cultural Nuance Navigator mobile application, you agree to be bound by these Terms of Service. 
          If you do not agree to these terms, please do not use our application.
        </Text>
        
        <Text style={styles.sectionTitle}>2. Description of Service</Text>
        <Text style={styles.paragraph}>
          Cultural Nuance Navigator provides cultural insights, analysis of text communications in cross-cultural contexts, 
          cultural briefings, and related services to help users navigate cultural differences.
        </Text>
        
        <Text style={styles.sectionTitle}>3. User Accounts</Text>
        <Text style={styles.paragraph}>
          To use certain features of our application, you may be required to create an account. You are responsible for:
        </Text>
        <Text style={styles.bulletPoint}>• Maintaining the confidentiality of your account information</Text>
        <Text style={styles.bulletPoint}>• All activities that occur under your account</Text>
        <Text style={styles.bulletPoint}>• Notifying us immediately of any unauthorized use of your account</Text>
        
        <Text style={styles.sectionTitle}>4. User Content</Text>
        <Text style={styles.paragraph}>
          When you submit text for analysis or provide other content through our application:
        </Text>
        <Text style={styles.bulletPoint}>• You retain ownership of your content</Text>
        <Text style={styles.bulletPoint}>• You grant us a license to use, process, and analyze your content to provide our services</Text>
        <Text style={styles.bulletPoint}>• You agree not to submit content that is unlawful, offensive, or infringes on others' rights</Text>
        
        <Text style={styles.sectionTitle}>5. Intellectual Property</Text>
        <Text style={styles.paragraph}>
          The application, including all content, features, and functionality, is owned by Cultural Nuance Navigator and is protected by copyright, 
          trademark, and other intellectual property laws.
        </Text>
        
        <Text style={styles.sectionTitle}>6. Disclaimer of Warranties</Text>
        <Text style={styles.paragraph}>
          The application and all content are provided "as is" without warranty of any kind. We do not guarantee that:
        </Text>
        <Text style={styles.bulletPoint}>• The application will meet your specific requirements</Text>
        <Text style={styles.bulletPoint}>• The application will be uninterrupted, timely, secure, or error-free</Text>
        <Text style={styles.bulletPoint}>• The results from using the application will be accurate or reliable</Text>
        <Text style={styles.paragraph}>
          Cultural insights provided are general in nature and may not apply to all individuals from a particular culture.
        </Text>
        
        <Text style={styles.sectionTitle}>7. Limitation of Liability</Text>
        <Text style={styles.paragraph}>
          To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages 
          resulting from your use of or inability to use the application.
        </Text>
        
        <Text style={styles.sectionTitle}>8. Changes to Terms</Text>
        <Text style={styles.paragraph}>
          We reserve the right to modify these Terms of Service at any time. We will provide notice of significant changes by updating the "Last Updated" date.
          Your continued use of the application after such modifications constitutes your acceptance of the updated terms.
        </Text>
        
        <Text style={styles.sectionTitle}>9. Governing Law</Text>
        <Text style={styles.paragraph}>
          These Terms of Service shall be governed by and construed in accordance with the laws of the United States, 
          without regard to its conflict of law provisions.
        </Text>
        
        <Text style={styles.sectionTitle}>10. Contact Us</Text>
        <Text style={styles.paragraph}>
          If you have any questions about these Terms of Service, please contact us at:
        </Text>
        <Text style={styles.paragraph}>
          legal@culturalnuancenavigator.com
        </Text>
        
        <View style={styles.footer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 24,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  lastUpdated: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 24,
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
    marginBottom: 16,
  },
  bulletPoint: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
    marginBottom: 8,
    marginLeft: 16,
  },
  footer: {
    height: 40,
  },
});

export default TermsOfServiceScreen; 