

declare interface TransformProperties {
  size?: number;
  color?: string;
  strokeWidth?: number;
  strokeColor?: string;
  opacity?: number;
  contents?: string;
}

declare interface HoverBehavior {
  domElement: HTMLElement;
  transformProps: TransformProperties;
  custom?: boolean;
}
