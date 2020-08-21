// utility function to convert CSS computed values to px
function parseCSSVars(val) {
  if (typeof val === 'number' || Number(val) === val) {
    return Number(val);
  }

  if (typeof val === 'string' && !val.length) {
    return 0;
  }

  if (val.endsWith('px')) {
    return val.substring(0, val.length - 2);
  } else if (val.endsWith('rem')) {
    return val.substring(0, val.length - 3) * 16;
  }

  throw new Error('Unsupported variable type');
}

// linear interpolation function
export function lerp(start, end, amt) {
  start = parseCSSVars(start);
  end = parseCSSVars(end);

  return (1 - amt) * start + amt * end;
}