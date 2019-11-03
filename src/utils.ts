/**
 * Copies items from the given iterable into an array
 */
export function copyIntoAnArray<T>(iterable: Iterable<T>) {
  // Optimization for arrays, as .slice() by far fastest way to
  // create a shallow copy https://jsbench.me/pmk2aqrlo1
  if (Array.isArray(iterable)) {
    return iterable.slice();
  }

  // With iterables for-of loop is the fastest https://jsbench.me/pwk2ar61ei
  const result = [];
  for (const item of iterable) {
    result.push(item);
  }

  return result;
}

/**
 * Creates an iterable from given generator function
 *
 * @param generatorFn
 * @param args
 */
export const iterableFromGenerator = <TItem>(
  generatorFn: Function,
  args?: any[]
): Iterable<TItem> => ({
  [Symbol.iterator]: (): Iterator<TItem> => generatorFn.apply(undefined, args),
});
