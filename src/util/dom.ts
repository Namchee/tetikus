import { TransformProps, CSSStyles, CSSAnimation } from './../common/types';
import {
  defaultTransitionSpeed,
  defaultEasingFunction,
  defaultDelay,
} from './../components/Tetikus/options';
import { TetikusException } from './../exceptions/TetikusException';
import { ExceptionLevel } from './../common/types';

interface CSSMap {
  unit: string;
  cssProp: string;
  calc?: (value: string | number) => string;
}

const keyMap: Map<string, CSSMap> = new Map([
  [
    'scale',
    {
      cssProp: 'transform',
      unit: '',
      calc: (value: string | number) => {
        return `scale(${value})`;
      },
    },
  ],
  [
    'color',
    { cssProp: 'background', unit: '' },
  ],
  [
    'borderWidth',
    {
      cssProp: 'border-width',
      unit: 'px',
    },
  ],
  [
    'borderColor',
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
  const duration = `${props[key]?.duration || defaultTransitionSpeed.value}ms`;
  const easing = props[key]?.easing || defaultEasingFunction.value;
  const delay = `${props[key]?.delay || defaultDelay.value}ms`;

  return `${cssProp} ${duration} ${easing} ${delay}`;
}

/**
 * Generate CSS transform style from two Tetikus props
 *
 * @param {TransformProps} ref Reference property
 * @param {TransformProps} props Desired transformation property
 * @param {boolean} pickRef Indicates if any missing transition properties
 * should be referenced from source or not
 * @returns CSS-compatible transition properties and options
 */
export function generateCSSTransform(
  ref: TransformProps,
  props: TransformProps,
  pickRef: boolean,
): CSSAnimation {
  const cssStyles: CSSStyles = {};
  const transitions: string[] = [];

  for (const key of Object.keys(props)) {
    const cssMap = keyMap.get(key);

    if (!cssMap) {
      new TetikusException(
        /* eslint-disable-next-line */
        `Unregistered property transformation ${key}. Transformation property will be ignored`,
        ExceptionLevel.WARNING,
      );
      continue;
    }

    const val = ['string', 'number'].includes(typeof props[key]) ?
      props[key] :
      props[key].value;

    cssStyles[cssMap.cssProp] = cssMap.calc ?
      cssMap.calc(val) :
      `${val}${cssMap.unit}`;

    transitions.push(
      generateTransitionString(cssMap.cssProp, pickRef ? ref : props, key),
    );
  }

  return {
    cssStyles,
    transitionString: transitions.join(', '),
  };
}
