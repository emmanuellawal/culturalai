import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { CulturalBriefingStackParamList } from '../types/navigation';
import CultureSelectionScreen from '../screens/CultureSelectionScreen';
import CulturalBriefingDetailScreen from '../screens/CulturalBriefingDetailScreen';

const Stack = createStackNavigator<CulturalBriefingStackParamList>();

const CulturalBriefingStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="CultureSelection"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="CultureSelection" component={CultureSelectionScreen} />
      <Stack.Screen name="CulturalBriefingDetail" component={CulturalBriefingDetailScreen} />
    </Stack.Navigator>
  );
};

export default CulturalBriefingStack; 