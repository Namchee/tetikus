export interface TransitionProperties<T> {
  value: T;
  duration?: number;
  delay?: number;
}

export interface TransformProperties {
  size?: TransitionProperties<number>;
  color?: TransitionProperties<string>;
  strokeWidth?: TransitionProperties<number>;
  strokeColor?: TransitionProperties<string>;
  opacity?: TransitionProperties<number>;
  contents?: string;
}

export interface HoverState {
  domElement: HTMLElement;
  transformProps: TransformProperties;
  componentName?: string;
}
