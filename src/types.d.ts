export interface TransformOpts<T> {
  value: T;
  duration?: number;
  delay?: number;
  easing?: string;
}
export interface TransformProps {
  scale?: TransformOpts<number> | number;
  color?: TransformOpts<string> | string;
  strokeWidth?: TransformOpts<number> | number;
  strokeColor?: TransformOpts<string> | string;
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
  custom?: boolean;
}
