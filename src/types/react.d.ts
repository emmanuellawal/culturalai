declare module 'react' {
  export interface ReactElement<P = any, T = any> {
    type: T;
    props: P;
    key: string | null;
  }

  export interface ReactNode {
    children?: ReactNode;
  }

  export function createElement(
    type: any,
    props?: any,
    ...children: any[]
  ): ReactElement;

  export const Fragment: any;

  export default {
    createElement,
    Fragment
  };
} 