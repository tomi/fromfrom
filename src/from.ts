import { Enumerable } from "./Enumerable";
import { Dictionary, ObjectIterable } from "./ObjectIterable";

export function from<T>(object: Dictionary<T>): Enumerable<[string, T]>;
export function from<T>(iterable: Iterable<T>): Enumerable<T>;
export function from<T>(
  iterable: Iterable<T> | Dictionary<T>
): Enumerable<T> | Enumerable<[string, T]> {
  if (iterable instanceof Enumerable) {
    return iterable;
  } else if (typeof (iterable as any)[Symbol.iterator] === "function") {
    return new Enumerable(iterable as Iterable<T>);
  } else {
    return new Enumerable(new ObjectIterable(iterable as Dictionary<T>));
  }
}
