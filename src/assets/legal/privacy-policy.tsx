import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types/navigation';

type PrivacyPolicyScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PrivacyPolicy'>;

type Props = {
  navigation: PrivacyPolicyScreenNavigationProp;
};

const PrivacyPolicyScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView style={styles.content}>
        <Text style={styles.lastUpdated}>Last Updated: {new Date().toLocaleDateString()}</Text>
        
        <Text style={styles.sectionTitle}>1. Introduction</Text>
        <Text style={styles.paragraph}>
          Welcome to Cultural Nuance Navigator. We respect your privacy and are committed to protecting your personal data. 
          This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application.
        </Text>
        
        <Text style={styles.sectionTitle}>2. Information We Collect</Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>2.1 Personal Information:</Text> When you create an account, we collect your email address and password.
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>2.2 Usage Data:</Text> We collect information about how you interact with our app, including:
        </Text>
        <Text style={styles.bulletPoint}>• Cultures you view and select</Text>
        <Text style={styles.bulletPoint}>• Text you submit for cultural analysis</Text>
        <Text style={styles.bulletPoint}>• Features you use within the app</Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>2.3 Device Information:</Text> We collect information about your device, including device type, operating system, and unique device identifiers.
        </Text>
        
        <Text style={styles.sectionTitle}>3. How We Use Your Information</Text>
        <Text style={styles.paragraph}>We use your information to:</Text>
        <Text style={styles.bulletPoint}>• Provide and maintain our services</Text>
        <Text style={styles.bulletPoint}>• Improve and personalize your experience</Text>
        <Text style={styles.bulletPoint}>• Analyze text for cultural context and provide feedback</Text>
        <Text style={styles.bulletPoint}>• Communicate with you about updates or changes</Text>
        <Text style={styles.bulletPoint}>• Ensure the security of our services</Text>
        
        <Text style={styles.sectionTitle}>4. Data Storage and Security</Text>
        <Text style={styles.paragraph}>
          We implement appropriate technical and organizational measures to protect your personal information. 
          However, no method of transmission over the internet or electronic storage is 100% secure.
        </Text>
        <Text style={styles.paragraph}>
          For the MVP version, we aim for transient processing of analyzed text, meaning we do not permanently store text submitted for analysis beyond the current session.
        </Text>
        
        <Text style={styles.sectionTitle}>5. Data Sharing and Disclosure</Text>
        <Text style={styles.paragraph}>
          We do not sell your personal information. We may share information with:
        </Text>
        <Text style={styles.bulletPoint}>• Service providers who help us deliver our services</Text>
        <Text style={styles.bulletPoint}>• Legal authorities when required by law</Text>
        
        <Text style={styles.sectionTitle}>6. Your Choices</Text>
        <Text style={styles.paragraph}>
          You can:
        </Text>
        <Text style={styles.bulletPoint}>• Access and update your account information</Text>
        <Text style={styles.bulletPoint}>• Opt-out of allowing your anonymized data to be used for improving our AI models</Text>
        <Text style={styles.bulletPoint}>• Request deletion of your account and associated data</Text>
        
        <Text style={styles.sectionTitle}>7. Children's Privacy</Text>
        <Text style={styles.paragraph}>
          Our services are not intended for children under 13. We do not knowingly collect information from children under 13.
        </Text>
        
        <Text style={styles.sectionTitle}>8. Changes to This Policy</Text>
        <Text style={styles.paragraph}>
          We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date.
        </Text>
        
        <Text style={styles.sectionTitle}>9. Contact Us</Text>
        <Text style={styles.paragraph}>
          If you have any questions about this Privacy Policy, please contact us at:
        </Text>
        <Text style={styles.paragraph}>
          privacy@culturalnuancenavigator.com
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
  bold: {
    fontWeight: 'bold',
  },
  footer: {
    height: 40,
  },
});

export default PrivacyPolicyScreen; 