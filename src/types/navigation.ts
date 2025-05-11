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
  CulturalBriefings: NavigatorScreenParams<CulturalBriefingStackParamList>;
  Analysis: undefined;
  Idioms: NavigatorScreenParams<IdiomsStackParamList>;
  ImageAnalysis: undefined;
  Settings: undefined;
};

// Cultural Briefing stack parameter list
export type CulturalBriefingStackParamList = {
  CultureSelection: undefined;
  CulturalBriefingDetail: { cultureId: string };
};

// Idioms stack parameter list
export type IdiomsStackParamList = {
  IdiomSearch: undefined;
  IdiomDetail: { idiomId: string, idiomPhrase?: string };
}; 