import { ComparerFn } from "../types";
import { copyIntoAnArray } from "../utils";

export function* sortBy<TItem>(
  iterable: Iterable<TItem>,
  comparer: ComparerFn<TItem>
) {
  yield* copyIntoAnArray(iterable).sort(comparer);
}
