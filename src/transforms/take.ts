export function* take<TItem>(iterable: Iterable<TItem>, howMany: number) {
  if (howMany < 1) {
    return;
  }

  let numTaken = 0;

  for (const item of iterable) {
    numTaken++;
    yield item;

    if (numTaken >= howMany) {
      break;
    }
  }
}
