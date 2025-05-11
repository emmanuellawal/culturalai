import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import CulturalBriefingStack from './CulturalBriefingStack';
import TextAnalysisScreen from '../screens/TextAnalysisScreen';
import IdiomsStack from './IdiomsStack';
import { MainTabParamList } from '../types/navigation';

// Create placeholder screens for the other tabs
const PlaceholderScreen = ({ title }: { title: string }) => (
  <HomeScreen />
);

// Use TextAnalysisScreen for Analysis tab
const SettingsScreen = () => <PlaceholderScreen title="Settings" />;

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTab = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'CulturalBriefings') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'Analysis') {
            iconName = focused ? 'analytics' : 'analytics-outline';
          } else if (route.name === 'Idioms') {
            iconName = focused ? 'chatbubble' : 'chatbubble-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else {
            iconName = 'help-circle-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4A6FA5',
        tabBarInactiveTintColor: 'gray',
        headerShown: route.name !== 'CulturalBriefings' && route.name !== 'Idioms', // Hide header for CulturalBriefings and Idioms since they have their own stack
        headerStyle: {
          backgroundColor: '#4A6FA5',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'Home' }}
      />
      <Tab.Screen 
        name="CulturalBriefings" 
        component={CulturalBriefingStack} 
        options={{ title: 'Cultural Briefings' }} 
      />
      <Tab.Screen 
        name="Analysis" 
        component={TextAnalysisScreen} 
        options={{ title: 'Analysis' }} 
      />
      <Tab.Screen 
        name="Idioms" 
        component={IdiomsStack} 
        options={{ title: 'Idioms' }} 
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ title: 'Settings' }} 
      />
    </Tab.Navigator>
  );
};

export default MainTab; 