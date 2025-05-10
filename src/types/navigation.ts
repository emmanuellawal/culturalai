import { NavigatorScreenParams } from '@react-navigation/native';

// Define the root stack navigator parameter list
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
};

// Auth stack navigator parameter list
export type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
};

// Main tab navigator parameter list
export type MainTabParamList = {
  Home: undefined;
  CulturalBriefings: undefined;
  Analysis: undefined;
  Idioms: undefined;
  Settings: undefined;
}; 