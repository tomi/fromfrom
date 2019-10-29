import { MapFn } from "../types";

export function* flatMap<TItem, TOther>(
  iterable: Iterable<TItem>,
  mapperFn: MapFn<TItem, TOther[]>
) {
  for (const item of iterable) {
    const sequence = mapperFn(item);
    yield* sequence;
  }
}
