import { copyIntoAnArray } from "../utils";

export function* reverse<TItem>(iterable: Iterable<TItem>) {
  const items = copyIntoAnArray(iterable);

  for (let i = items.length - 1; i >= 0; i--) {
    yield items[i];
  }
}
