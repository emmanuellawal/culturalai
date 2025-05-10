import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainTabParamList, RootStackParamList } from '../types/navigation';
import { useAuth } from '../services/authContext';

type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Home'>,
  StackNavigationProp<RootStackParamList>
>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

const HomeScreen: React.FC<Props> = () => {
  const { user, signOut, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A6FA5" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Cultural Nuance Navigator</Text>
        <Text style={styles.welcomeText}>
          Welcome, {user?.email ?? 'User'}!
        </Text>
        <Text style={styles.instructionText}>
          This home screen will be expanded with features including:
        </Text>
        <View style={styles.featureList}>
          <Text style={styles.featureItem}>• Cultural Briefings</Text>
          <Text style={styles.featureItem}>• Real-Time Analysis</Text>
          <Text style={styles.featureItem}>• Idiom Demystifier</Text>
          <Text style={styles.featureItem}>• Scenario Simulator</Text>
        </View>
        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={signOut}
        >
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: 18,
    marginBottom: 30,
    color: '#4A6FA5',
    textAlign: 'center',
  },
  instructionText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  featureList: {
    alignSelf: 'stretch',
    marginLeft: 50,
    marginBottom: 40,
  },
  featureItem: {
    fontSize: 16,
    marginBottom: 8,
    color: '#555',
  },
  logoutButton: {
    backgroundColor: '#ff6b6b',
    borderRadius: 8,
    padding: 15,
    width: '80%',
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeScreen; 