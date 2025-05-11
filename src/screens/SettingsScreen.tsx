import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  Switch,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../services/authContext';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainTabParamList, RootStackParamList } from '../types/navigation';
import { 
  getTextAnalysisConsent, 
  getAIImprovementConsent, 
  storeTextAnalysisConsent, 
  storeAIImprovementConsent 
} from '../utils/consentManager';
import { requestDataDeletion, requestDataExport } from '../services/privacyService';

type SettingsScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Settings'>,
  StackNavigationProp<RootStackParamList>
>;

type Props = {
  navigation: SettingsScreenNavigationProp;
};

const SettingsScreen: React.FC<Props> = ({ navigation }) => {
  const { user, signOut } = useAuth();
  const [textAnalysisConsent, setTextAnalysisConsent] = useState<boolean>(false);
  const [aiImprovementConsent, setAiImprovementConsent] = useState<boolean>(false);
  const [isLoadingConsent, setIsLoadingConsent] = useState(true);
  const [isRequestingDeletion, setIsRequestingDeletion] = useState(false);
  const [isRequestingExport, setIsRequestingExport] = useState(false);

  useEffect(() => {
    // Load saved consent preferences
    const loadConsentPreferences = async () => {
      setIsLoadingConsent(true);
      const textConsent = await getTextAnalysisConsent();
      const aiConsent = await getAIImprovementConsent();
      
      setTextAnalysisConsent(textConsent === true);
      setAiImprovementConsent(aiConsent === true);
      setIsLoadingConsent(false);
    };
    
    loadConsentPreferences();
  }, []);

  const handleToggleTextAnalysisConsent = async (value: boolean) => {
    setTextAnalysisConsent(value);
    await storeTextAnalysisConsent(value);
    
    if (!value) {
      // If disabling text analysis consent, also disable AI improvement
      setAiImprovementConsent(false);
      await storeAIImprovementConsent(false);
    }
  };

  const handleToggleAIImprovementConsent = async (value: boolean) => {
    setAiImprovementConsent(value);
    await storeAIImprovementConsent(value);
    
    if (value && !textAnalysisConsent) {
      // If enabling AI improvement, must also enable text analysis consent
      setTextAnalysisConsent(true);
      await storeTextAnalysisConsent(true);
      
      Alert.alert(
        'Consent Update', 
        'Text Analysis Consent has also been enabled, as it\'s required for AI Improvement Consent.'
      );
    }
  };

  const handleDataDeletionRequest = async () => {
    Alert.alert(
      'Request Data Deletion',
      'This will initiate a process to delete all your data from our servers. This action cannot be undone. Do you want to proceed?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Request Deletion',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsRequestingDeletion(true);
              const result = await requestDataDeletion();
              setIsRequestingDeletion(false);
              
              if (result.success) {
                Alert.alert(
                  'Request Submitted',
                  'Your data deletion request has been submitted. We will process it within 30 days and send you a confirmation email.'
                );
              } else {
                throw new Error('Failed to submit request');
              }
            } catch (error) {
              setIsRequestingDeletion(false);
              Alert.alert(
                'Error',
                'Failed to submit data deletion request. Please try again later.'
              );
            }
          }
        }
      ]
    );
  };

  const handleDataExportRequest = async () => {
    Alert.alert(
      'Request Data Export',
      'This will initiate a process to export all your data. We will send you an email with your data within 30 days.',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Request Export',
          onPress: async () => {
            try {
              setIsRequestingExport(true);
              const result = await requestDataExport();
              setIsRequestingExport(false);
              
              if (result.success) {
                Alert.alert(
                  'Request Submitted',
                  'Your data export request has been submitted. We will process it within 30 days and send you an email with your data.'
                );
              } else {
                throw new Error('Failed to submit request');
              }
            } catch (error) {
              setIsRequestingExport(false);
              Alert.alert(
                'Error',
                'Failed to submit data export request. Please try again later.'
              );
            }
          }
        }
      ]
    );
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };

  const showComingSoonAlert = (feature: string) => {
    Alert.alert(
      "Coming Soon",
      `The ${feature} feature will be available in a future update.`,
      [{ text: "OK" }]
    );
  };

  const renderSettingItem = (
    title: string, 
    icon: keyof typeof Ionicons.glyphMap, 
    onPress: () => void, 
    rightElement?: React.ReactNode
  ) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingItemLeft}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={22} color="#4A6FA5" />
        </View>
        <Text style={styles.settingTitle}>{title}</Text>
      </View>
      <View style={styles.settingItemRight}>
        {rightElement || <Ionicons name="chevron-forward" size={20} color="#999" />}
      </View>
    </TouchableOpacity>
  );

  const renderSectionHeader = (title: string) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>

        <View style={styles.userInfoContainer}>
          <View style={styles.userAvatarPlaceholder}>
            <Text style={styles.userAvatarText}>
              {user?.email?.substring(0, 1).toUpperCase() || 'U'}
            </Text>
          </View>
          <Text style={styles.userEmail}>{user?.email || 'User'}</Text>
        </View>

        {renderSectionHeader("Account")}
        {renderSettingItem(
          "Change Password", 
          "key-outline", 
          () => showComingSoonAlert("change password")
        )}
        {renderSettingItem(
          "Delete Account", 
          "trash-outline", 
          () => showComingSoonAlert("delete account")
        )}
        {renderSettingItem(
          "Logout", 
          "log-out-outline", 
          handleLogout
        )}

        {renderSectionHeader("Preferences")}
        {renderSettingItem(
          "Notifications", 
          "notifications-outline", 
          () => showComingSoonAlert("notifications"),
          <Switch 
            value={false} 
            disabled={true}
            trackColor={{ false: '#d0d0d0', true: '#81b0ff' }}
            thumbColor={'#f4f3f4'}
          />
        )}
        {renderSettingItem(
          "Language (English)", 
          "language-outline", 
          () => showComingSoonAlert("language selection")
        )}
        {renderSettingItem(
          "Appearance", 
          "contrast-outline", 
          () => showComingSoonAlert("appearance settings")
        )}

        {renderSectionHeader("Privacy & Data")}
        {renderSettingItem(
          "Privacy Policy", 
          "shield-checkmark-outline", 
          () => navigation.navigate('PrivacyPolicy')
        )}
        {renderSettingItem(
          "Terms of Service", 
          "document-text-outline", 
          () => navigation.navigate('TermsOfService')
        )}
        {renderSettingItem(
          "Text Analysis Consent", 
          "analytics-outline", 
          () => {}, // No action on press, just toggle
          isLoadingConsent ? (
            <ActivityIndicator size="small" color="#4A6FA5" />
          ) : (
            <Switch 
              value={textAnalysisConsent}
              onValueChange={handleToggleTextAnalysisConsent}
              trackColor={{ false: '#d0d0d0', true: '#81b0ff' }}
              thumbColor={'#f4f3f4'}
            />
          )
        )}
        {renderSettingItem(
          "AI Improvement Consent", 
          "bulb-outline", 
          () => {}, // No action on press, just toggle
          isLoadingConsent ? (
            <ActivityIndicator size="small" color="#4A6FA5" />
          ) : (
            <Switch 
              value={aiImprovementConsent}
              disabled={!textAnalysisConsent}
              onValueChange={handleToggleAIImprovementConsent}
              trackColor={{ false: '#d0d0d0', true: '#81b0ff' }}
              thumbColor={textAnalysisConsent ? '#f4f3f4' : '#d0d0d0'}
            />
          )
        )}
        {renderSettingItem(
          "Request Data Deletion", 
          "trash-bin-outline", 
          handleDataDeletionRequest,
          isRequestingDeletion ? (
            <ActivityIndicator size="small" color="#4A6FA5" />
          ) : null
        )}
        {renderSettingItem(
          "Request Data Export", 
          "download-outline", 
          handleDataExportRequest,
          isRequestingExport ? (
            <ActivityIndicator size="small" color="#4A6FA5" />
          ) : null
        )}

        {renderSectionHeader("About")}
        {renderSettingItem(
          "App Version", 
          "information-circle-outline", 
          () => {}, 
          <Text style={styles.versionText}>1.0.0</Text>
        )}
        {renderSettingItem(
          "Send Feedback", 
          "mail-outline", 
          () => showComingSoonAlert("feedback form")
        )}
        
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  headerContainer: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginBottom: 0,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  userInfoContainer: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginBottom: 16,
  },
  userAvatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4A6FA5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  userAvatarText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 16,
    color: '#333',
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#f0f0f0',
  },
  sectionTitle: {
    fontWeight: '600',
    color: '#666',
    fontSize: 14,
  },
  settingItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 30,
    marginRight: 10,
  },
  settingTitle: {
    fontSize: 16,
    color: '#333',
  },
  settingItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  versionText: {
    fontSize: 14,
    color: '#999',
  },
});

export default SettingsScreen; 