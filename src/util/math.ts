import { TetikusException } from '@/exceptions/TetikusException';

// utility function to convert CSS computed values to px
function parseCSSVars(val: number | string): number {
  if (typeof val === 'number') {
    return Number(val);
  }

  if (typeof val === 'string' && !val.length) {
    return 0;
  }

  if (val.endsWith('px')) {
    return Number(val.substring(0, val.length - 2));
  } else if (val.endsWith('rem')) {
    return Number(val.substring(0, val.length - 3)) * 16;
  }

  throw new TetikusException(`Unsupported variable type from ${val}`);
}

/**
 * Calculate linear interpolation from start and target position
 *
 * @param {number | string} start Start position
 * @param {number | string} end End position
 * @param {number} amt Interpolation multiplier
 * @returns Interpolated position
 */
export function lerp(start: number | string, end: number | string, amt: number): number {
  const parsedStart: number = parseCSSVars(start);
  const parsedEnd: number = parseCSSVars(end);

  return (1 - amt) * parsedStart + amt * parsedEnd;
}
