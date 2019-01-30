import { IterableCreatorIterable } from "../IterableCreatorIterable";

export const createTakeIterable = <TItem>(
  iterable: Iterable<TItem>,
  howMany: number
): Iterable<TItem> =>
  new IterableCreatorIterable(function* take(): IterableIterator<TItem> {
    let numTaken = 0;

    for (const item of iterable) {
      if (numTaken < howMany) {
        numTaken++;
        yield item;
      } else {
        break;
      }
    }
  });
