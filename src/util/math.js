// linear interpolation function
export function lerp(start, end, amt) {
  if (typeof start === 'string') {
    start = start.substring(0, start.length - 2);
  }

  return (1 - amt) * start + amt * end;
}