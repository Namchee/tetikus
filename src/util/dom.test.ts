import test from 'ava';
import { stub } from 'sinon';
import { generateCSSTransform } from './dom';
import { CSSAnimation, TransformProps } from '../types';

test('should generate CSS transform correctly', t => {
  const transformRef = {
    scale: 1,
  };

  const transformTarget = {
    scale: { value: 0.8, duration: 250, easing: 'ease-in', delay: 10 },
  };

  const expected: CSSAnimation = {
    cssStyles: {
      transform: `scale(0.8)`,
    },
    transitionString: 'transform 250ms ease-in 10ms',
  };

  const transformResult = generateCSSTransform(transformRef, transformTarget, false);

  t.deepEqual(transformResult, expected);
});

test('should be able to transform all possible props', t => {
  const transformRef = {
    scale: 1,
  };

  const transformTarget = {
    borderColor: { value: 'red', duration: 5000, easing: 'ease-out', delay: 20 },
    borderWidth: { value: 0.8, duration: 250, easing: 'ease-in', delay: 10 },
    color: { value: 'blue', duration: 250, easing: 'ease-in', delay: 10 },
    opacity: { value: 0.8, duration: 250, easing: 'ease-in', delay: 10 },
    scale: { value: 0.8, duration: 250, easing: 'ease-in', delay: 10 },
  };

  const expected: CSSAnimation = {
    cssStyles: {
      transform: `scale(0.8)`,
      'border-width': '0.8px',
      'border-color': 'red',
      'background': 'blue',
      opacity: '0.8',
    },
    transitionString: 'transform 250ms ease-in 10ms, border-width 250ms ease-in 10ms, background 250ms ease-in 10ms, border-color 5000ms ease-out 20ms, opacity 250ms ease-in 10ms',
  };

  const transformResult = generateCSSTransform(transformRef, transformTarget, false);

  t.deepEqual(transformResult.cssStyles, expected.cssStyles);
  t.deepEqual(transformResult.transitionString.split(', ').sort(), expected.transitionString.split(', ').sort());
});

test('should be able to read defaults', t => {
  const transformRef = {
    scale: 1,
  };

  const transformTarget = {
    scale: 0.8,
  };

  const expected: CSSAnimation = {
    cssStyles: {
      transform: `scale(0.8)`,
    },
    transitionString: 'transform 200ms ease-out 0ms',
  };

  const transformResult = generateCSSTransform(transformRef, transformTarget, true);

  t.deepEqual(transformResult, expected);
});

test('should be able to read properties from reference', t => {
  const transformRef = {
    scale: { value: 0.9, duration: 500 },
  };

  const transformTarget = {
    scale: { value: 0.8, duration: 250, easing: 'ease-in', delay: 10 },
  };

  const expected: CSSAnimation = {
    cssStyles: {
      transform: `scale(0.8)`,
    },
    transitionString: 'transform 500ms ease-out 0ms',
  };

  const transformResult = generateCSSTransform(transformRef, transformTarget, true);

  t.deepEqual(transformResult, expected);
});

test('should warn on console when transform properties is unknown', t => {
  const consoleSpy = stub(console, 'warn');

  const transformRef = {};

  const transformTarget = {
    foo: 'bar',
  } as TransformProps;

  const expected: CSSAnimation = {
    cssStyles: {},
    transitionString: '',
  };

  const transformResult = generateCSSTransform(transformRef, transformTarget, false);

  t.deepEqual(transformResult, expected);
  t.is(consoleSpy.callCount, 1);

  consoleSpy.restore();
});