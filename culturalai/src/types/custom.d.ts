declare module 'react-native-safe-area-context' {
  import React from 'react';
  import { ViewProps } from 'react-native';

  export interface SafeAreaProviderProps extends ViewProps {
    children?: React.ReactNode;
  }

  export const SafeAreaProvider: React.FC<SafeAreaProviderProps>;
} 