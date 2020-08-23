export interface TransformOpts<T> {
  value: T;
  duration?: number;
  delay?: number;
  easing?: string;
}

export interface TransformProps {
  size?: TransformOpts<number>;
  color?: TransformOpts<string>;
  strokeWidth?: TransformOpts<number>;
  strokeColor?: TransformOpts<string>;
  opacity?: TransformOpts<number>;
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
