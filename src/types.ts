export type MapFn<TItem, TResult> = (item: TItem) => TResult;

export type PredicateFn<TItem> = (item: TItem) => boolean;

export type CallbackFn<TItem> = (item: TItem) => void;

export type KeySelectorFn<TItem, TKey> = (item: TItem) => TKey;

export type ReduceCallbackFn<TPrevious, TCurrent> = (
  previousValue: TPrevious,
  currentValue: TCurrent
) => TPrevious;

export type ComparerFn<TItem> = (a: TItem, b: TItem) => number;

export type IteratorCreatorFn<TResult> = () => Iterator<TResult>;

export interface Grouping<TKey, TElement> {
  key: TKey;
  items: TElement[];
}

export interface StringKeyedObject<T> {
  [index: string]: T;
}

export interface NumberKeyedObject<T> {
  [index: number]: T;
}
