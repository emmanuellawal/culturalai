declare module 'react' {
  export = React;
  export as namespace React;

  const React: any;
}

declare module 'react-native' {
  export const View: any;
  export const Text: any;
  export const StyleSheet: {
    create: (styles: any) => any;
  };
} 