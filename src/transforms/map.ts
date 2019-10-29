import { MapFn } from "../types";

export function* map<TItem, TResult>(
  source: Iterable<TItem>,
  mapFn: MapFn<TItem, TResult>
) {
  for (const item of source) {
    yield mapFn(item);
  }
}
