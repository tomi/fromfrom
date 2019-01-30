import { IteratorCreatorFn } from "./types";

/**
 * Wraps a function that returns an iterable
 */
export class IterableCreatorIterable<TResultItem> implements Iterable<TResultItem> {
  constructor(private _createIterator: IteratorCreatorFn<TResultItem>) {}

  [Symbol.iterator](): Iterator<TResultItem> {
    return this._createIterator();
  }
}
