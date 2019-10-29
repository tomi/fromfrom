export function* skip<TItem>(iterable: Iterable<TItem>, howMany: number) {
  let numSkipped = 0;

  for (const item of iterable) {
    if (numSkipped < howMany) {
      numSkipped++;
      continue;
    }

    yield item;
  }
}
