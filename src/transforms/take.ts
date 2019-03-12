import { IterableCreatorIterable } from "../IterableCreatorIterable";

export const createTakeIterable = <TItem>(
  iterable: Iterable<TItem>,
  howMany: number
): Iterable<TItem> =>
  new IterableCreatorIterable(function* take(): IterableIterator<TItem> {
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
  });
