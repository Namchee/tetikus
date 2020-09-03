/**
 * Limit function execution with certain time period
 *
 * @param {Function} func Function to be throttled
 * @param {number} timeout Time limit before function can be executed again
 * @returns Throttled version of original function
 */
export function throttle(func: Function, timeout: number) {
  let ready = true;

  return (...args) => {
    if (!ready) {
      return;
    }

    ready = false;
    func(...args);
    setTimeout(() => {
      ready = true;
    }, timeout);
  };
}
