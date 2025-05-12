declare module 'react-native' {
  import React from 'react';

  export interface ViewProps {
    style?: any;
    children?: React.ReactNode;
  }

  export interface TextProps {
    style?: any;
    children?: React.ReactNode;
  }

  export interface StyleSheetStatic {
    create<T extends Record<string, any>>(styles: T): T;
  }

  export class View extends React.Component<ViewProps> {}
  export class Text extends React.Component<TextProps> {}
  
  export const StyleSheet: StyleSheetStatic;
} 