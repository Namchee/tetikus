import { TransformProps, TransformOpts, CSSAnimation, CSSStyles } from '@/types';

interface ConverterFunction {
  (orig: Record<string, number | string>, target: TransformProps): string;
}

interface CSSMap {
  unit: string;
  cssProp?: string;
  calc?: ConverterFunction;
}

const keyMap: Map<string, CSSMap> = new Map([
  [
    'size',
    {
      cssProp: 'transform',
      calc: (orig: Record<string, number | string>, target: TransformProps) => {
        return `scale(${Number(target.size?.value || orig.size) / Number(orig.size)})`;
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
    { unit: '' },
  ],
]);

/**
 * Utility function to translate transformation options to `transition` property
 *
 * @param {string} prop CSS property name
 * @param {string} key Transformation key
 * @param {TransformOpts<string | number>} opts Transition configuration
 * @returns CSS-compatible `transition` property
 */
function generateTransitionString(
  prop: string,
  key: string,
  opts: Record<string, TransformOpts<string | number> >,
): string {
  const duration = `${opts[key].duration || 200}ms`;
  const easingFunc = opts[key].easing || 'ease-out';
  const delay = `${opts[key].delay !== undefined ? opts[key].delay : 0}ms`;

  return `${prop} ${duration} ${easingFunc} ${delay}`;
}


/**
 * Generate CSS style property from Tetikus props
 *
 * @param {Record<string, string | number>} props Tetikus props
 * @returns CSS-compatible style objects
 */
export function generateCSSStyles(props: Record<string, string | number>): CSSStyles {
  const cssStyles: CSSStyles = {};

  for (const key of Object.keys(props)) {
    const cssMap = keyMap.get(key) as CSSMap;

    if (!cssMap) {
      continue;
    }

    cssStyles[cssMap.cssProp || key] = cssMap.calc ?
      cssMap.calc(props, props) :
      `${props[key]}${cssMap.unit}`;
  }

  return cssStyles;
}

/**
 * Generate CSS transform style from two Tetikus props
 *
 * @param {Record<string | number>} orig Original property
 * @param {Record<string, TransformOpts<string | number>} target Desired transformation property
 * @returns CSS-compatible transition properties and options
 */
export function generateCSSTransform(
  orig: Record<string, string | number>,
  target: Record<string, TransformOpts<string | number> >
): CSSAnimation {
  const cssStyles: CSSStyles = {};
  const transitions: string[] = [];

  for (const key of Object.keys(target)) {
    const cssMap = keyMap.get(key);

    if (!cssMap) {
      console.error(`Unregistered property transformation ${key}. Transformation property will be ignored`);
      continue;
    }

    cssStyles[cssMap.cssProp || key] = cssMap.calc ?
      cssMap.calc(orig, target) :
      `${target[key].value}${cssMap.unit}`;

    transitions.push(
      generateTransitionString(cssMap.cssProp || key, key, target),
    );
  }

  return {
    cssStyles,
    transitionString: transitions.join(', '),
  };
}
