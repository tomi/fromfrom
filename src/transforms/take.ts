export function* take<TItem>(iterable: Iterable<TItem>, howMany: number): IterableIterator<TItem> {
  let numTaken = 0;

  for (const item of iterable) {
    if (numTaken < howMany) {
      numTaken++;
      yield item;
    } else {
      break;
    }
  }
}
