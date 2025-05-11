import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { IdiomsStackParamList } from '../types/navigation';
import IdiomSearchScreen from '../screens/IdiomSearchScreen';
import IdiomDetailScreen from '../screens/IdiomDetailScreen';

const Stack = createStackNavigator<IdiomsStackParamList>();

const IdiomsStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#4A6FA5',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="IdiomSearch" 
        component={IdiomSearchScreen} 
        options={{ title: 'Idiom Demystifier' }}
      />
      <Stack.Screen
        name="IdiomDetail"
        component={IdiomDetailScreen}
        options={({ route }) => ({ 
          title: route.params?.idiomPhrase || 'Idiom Details' 
        })}
      />
    </Stack.Navigator>
  );
};

export default IdiomsStack; 