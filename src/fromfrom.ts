/**
 * Entrypoint of the library
 */
import { SequenceImpl } from "./Sequence";
import { createObjectIterable } from "./ObjectIterable";
import {
  CallbackFn,
  ComparePredicate,
  ComparerFn,
  Grouping,
  KeySelectorFn,
  MapFn,
  NumberKeyedObject,
  OrderedSequence,
  PredicateFn,
  ReduceCallbackFn,
  Sequence,
  StringKeyedObject,
} from "./types";

function _isIterable<T>(object: any): object is Iterable<T> {
  return typeof object[Symbol.iterator] === "function";
}

export function from<T>(iterable: Iterable<T>): Sequence<T>;
export function from<T>(object: StringKeyedObject<T>): Sequence<[string, T]>;
export function from<T>(object: NumberKeyedObject<T>): Sequence<[number, T]>;
export function from<T>(
  iterable: Iterable<T> | StringKeyedObject<T> | NumberKeyedObject<T>
): Sequence<T> | Sequence<[string, T]> | Sequence<[number, T]> {
  if (iterable instanceof SequenceImpl) {
    return iterable;
  } else if (_isIterable(iterable)) {
    return new SequenceImpl(iterable);
  } else {
    return new SequenceImpl(createObjectIterable(iterable));
  }
}

export {
  CallbackFn,
  ComparePredicate,
  ComparerFn,
  Grouping,
  KeySelectorFn,
  MapFn,
  NumberKeyedObject,
  OrderedSequence,
  PredicateFn,
  ReduceCallbackFn,
  Sequence,
  StringKeyedObject,
};
