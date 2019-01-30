export interface PredicateFn<TItem> {
  (item: TItem): boolean;
}

export interface SelectorFn<TItem, TResult> {
  (item: TItem): TResult;
}

export interface Callback<TItem> {
  (item: TItem): void;
}

export interface ReduceCallback<TPrevious, TCurrent> {
  (previousValue: TPrevious, currentValue: TCurrent): TPrevious;
}

export interface ComparerFn<TItem> {
  (a: TItem, b: TItem): number;
}

export interface Grouping<TKey, TElement> {
  key: TKey;
  items: TElement[];
}

export type KeySelectorFn<TItem, TKey> = SelectorFn<TItem, TKey>;

export interface StringKeyedObject<T> {
  [index: string]: T;
}

export interface NumberKeyedObject<T> {
  [index: number]: T;
}
