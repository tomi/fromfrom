import { Enumerable } from "./Enumerable";
import { StringKeyedObject, NumberKeyedObject, createObjectIterable } from "./ObjectIterable";

export function from<T>(iterable: Iterable<T>): Enumerable<T>;
export function from<T>(object: StringKeyedObject<T>): Enumerable<[string, T]>;
export function from<T>(object: NumberKeyedObject<T>): Enumerable<[number, T]>;
export function from<T>(
  iterable: Iterable<T> | StringKeyedObject<T> | NumberKeyedObject<T>
): Enumerable<T> | Enumerable<[string, T]> | Enumerable<[number, T]> {
  if (iterable instanceof Enumerable) {
    return iterable;
  } else if (_isIterable(iterable)) {
    return new Enumerable(iterable);
  } else {
    return new Enumerable(createObjectIterable(iterable));
  }
}

function _isIterable<T>(object: any): object is Iterable<T> {
  return typeof object[Symbol.iterator] === "function";
}
