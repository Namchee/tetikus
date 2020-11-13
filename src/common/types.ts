// Exception level to be thrown.
// Internal usage
export enum ExceptionLevel {
  WARNING = 1,
  ERROR = 2,
}

// Options to be passed on `app.use()` calls
export interface ConstructorOptions {
  directiveName?: string;
  transitionSpeed?: number;
  easing?: string;
  delay?: number;
}

// Options to be passed on props change
// Example: color: { value: black }, then tetikus background
// will be changed to black
export interface TransformOpts<T> {
  value: T;
  duration?: number;
  delay?: number;
  easing?: string;
}

// Options to be passed on click or hover events.
export interface TransformProps {
  id?: string | string[];
  scale?: TransformOpts<number> | number;
  color?: TransformOpts<string> | string;
  borderWidth?: TransformOpts<number> | number;
  borderColor?: TransformOpts<string> | string;
  opacity?: TransformOpts<number> | number;
}

// Internal usage
export interface CSSStyles {
  [key: string]: string | number;
}

// Internal usage
export interface CSSAnimation {
  cssStyles: CSSStyles;
  transitionString: string;
}

// Expected behavior from domElement on hover interaction
export interface HoverBehavior {
  domElement: HTMLElement;
  transformProps: TransformProps;
}

// Unified tetikus props
// Useful to avoid apropcalypse
export interface TetikusProps {
  showDefaultCursor?: boolean;
  throttleSpeed?: number;
  borderWidth?: number;
  color?: string;
  borderColor?: string;
  size?: number;
  inverColor?: boolean;
  buttonMap?: string[];
  clickBehavior?: TransformProps;
  showOnTouch?: boolean;
  opacity?: number;
  hideOnOut?: boolean;
  contentPosition?: string;
  lerp?: number;
  defaultTransitionSpeed?: number;
  defaultEasing?: string;
  defaultDelay?: number;
}
