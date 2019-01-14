import { Enumerable } from "./Enumerable";

export function from<T>(iterable: Iterable<T>): Enumerable<T> {
  return new Enumerable(iterable);
}
