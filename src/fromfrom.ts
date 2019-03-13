/**
 * Entrypoint of the library
 */
import { Sequence } from "./Sequence";
import { createObjectIterable } from "./ObjectIterable";
import { StringKeyedObject, NumberKeyedObject } from "./types";

export function from<T>(iterable: Iterable<T>): Sequence<T>;
export function from<T>(object: StringKeyedObject<T>): Sequence<[string, T]>;
export function from<T>(object: NumberKeyedObject<T>): Sequence<[number, T]>;
export function from<T>(
  iterable: Iterable<T> | StringKeyedObject<T> | NumberKeyedObject<T>
): Sequence<T> | Sequence<[string, T]> | Sequence<[number, T]> {
  if (iterable instanceof Sequence) {
    return iterable;
  } else if (_isIterable(iterable)) {
    return new Sequence(iterable);
  } else {
    return new Sequence(createObjectIterable(iterable));
  }
}

function _isIterable<T>(object: any): object is Iterable<T> {
  return typeof object[Symbol.iterator] === "function";
}
