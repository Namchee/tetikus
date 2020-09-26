export enum ExceptionLevel {
  WARNING = 1,
  ERROR = 2,
}

export interface TetikusOptions {
  directiveName?: string;
  transitionSpeed?: number;
  easing?: string;
  delay?: number;
}

export interface TransformOpts<T> {
  value: T;
  duration?: number;
  delay?: number;
  easing?: string;
}

export interface TransformProps {
  id?: string | string[];
  scale?: TransformOpts<number> | number;
  color?: TransformOpts<string> | string;
  borderWidth?: TransformOpts<number> | number;
  borderColor?: TransformOpts<string> | string;
  opacity?: TransformOpts<number> | number;
}

export interface CSSStyles {
  [key: string]: string | number;
}

export interface CSSAnimation {
  cssStyles: CSSStyles;
  transitionString: string;
}

export interface HoverBehavior {
  domElement: HTMLElement;
  transformProps: TransformProps;
}
