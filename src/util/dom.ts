import { TransformProps, CSSStyles, CSSAnimation } from '@/types';
import { defaultTransitionSpeed, defaultEasingFunction, defaultDelay } from '@/components/Tetikus/options';
import { TetikusException, ExceptionLevel } from '@/exceptions/TetikusException';

interface ConverterFunction {
  (ref: Record<string, number | string>, props: TransformProps): string;
}

interface CSSMap {
  unit: string;
  cssProp: string;
  calc?: ConverterFunction;
}

const keyMap: Map<string, CSSMap> = new Map([
  [
    'size',
    {
      cssProp: 'transform',
      calc: (orig: Record<string, any>, target: TransformProps) => {
        const sourceValue = target.size ?
          (typeof target.size === 'number' ? target.size : target.size.value) :
          orig.size;

        const val = sourceValue / orig.size;

        return `scale(${val})`;
      },
      unit: 'px',
    }
  ],
  [
    'color',
    { cssProp: 'background', unit: '' },
  ],
  [
    'strokeWidth',
    {
      cssProp: 'border-width',
      unit: 'px',
    },
  ],
  [
    'strokeColor',
    {
      cssProp: 'border-color',
      unit: '',
    },
  ],
  [
    'opacity',
    {
      cssProp: 'opacity',
      unit: '',
    },
  ],
]);

/**
 * Utility function to translate transformation options to `transition` property
 *
 * @param {string} cssProp CSS property name
 * @param {TransformProps} props Transform properties
 * @param {string} key Transformation key
 * @returns CSS-compatible `transition` property
 */
function generateTransitionString(
  cssProp: string,
  props: TransformProps,
  key: string,
): string {
  const duration = `${props[key].duration || defaultTransitionSpeed.value}ms`;
  const easingFunc = props[key].easing || defaultEasingFunction.value;
  const delay = `${props[key].delay !== undefined ? props[key].delay : defaultDelay.value}ms`;

  return `${cssProp} ${duration} ${easingFunc} ${delay}`;
}

/**
 * Generate CSS style property from Tetikus props
 *
 * @param {Record<string, any>} ref Reference property / state
 * @returns CSS-compatible style objects
 */
export function generateCSSStyles(ref: Record<string, any>): CSSStyles {
  const cssStyles: CSSStyles = {};

  for (const key of Object.keys(ref)) {
    const cssMap = keyMap.get(key) as CSSMap;

    if (!cssMap) {
      continue;
    }

    cssStyles[cssMap.cssProp] = cssMap.calc ?
      cssMap.calc(ref, ref) :
      `${ref[key]}${cssMap.unit}`;
  }

  return cssStyles;
}

/**
 * Generate reference property from transformation props
 *
 * @param {TransformProps} props Transformation property
 * @returns Reference property in form of `Record<string, any>`
 * (similar to Tetikus props)
 */
export function generateRefFromProps(props: TransformProps): Record<string, any> {
  const ref: Record<string, any> = {};

  for (const key of Object.keys(props)) {
    ref[key] = typeof props[key] === 'object' ?
      props[key].value :
      props[key];
  }

  return ref;
}

/**
 * Generate CSS transform style from two Tetikus props
 *
 * @param {Record<any>} ref Reference property
 * @param {TransformProps} props Desired transformation property
 * @returns CSS-compatible transition properties and options
 */
export function generateCSSTransform(
  ref: Record<string, any>,
  props: TransformProps,
): CSSAnimation {
  const cssStyles: CSSStyles = {};
  const transitions: string[] = [];

  for (const key of Object.keys(props)) {
    const cssMap = keyMap.get(key);

    if (!cssMap) {
      new TetikusException(`Unregistered property transformation ${key}. Transformation property will be ignored`, ExceptionLevel.WARNING);
      continue;
    }

    const val = ['string', 'number'].includes(typeof props[key]) ? props[key] : props[key].value;

    cssStyles[cssMap.cssProp] = cssMap.calc ?
      cssMap.calc(ref, props) :
      `${val}${cssMap.unit}`;

    transitions.push(
      generateTransitionString(cssMap.cssProp, props, key),
    );
  }

  return {
    cssStyles,
    transitionString: transitions.join(', '),
  };
}
