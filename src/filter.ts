import {
  FinalReducer,
  NonFinalReducer,
  ReturnEarly,
  ReturnEarlyType,
} from './compose';

// Non-final reducer
export function filter<T, TOut extends T | ReturnEarlyType>(
  filterFn: (value: T) => boolean
): NonFinalReducer<T, TOut>;
// Final reducer
export function filter<T, TResult>(
  filterFn: (value: T) => boolean
): FinalReducer<T, TResult>;

export function filter<T>(filterFn: (value: T) => boolean) {
  let accumulator: T[] = [];

  return function filterReducer(value: T, isFinal: boolean) {
    const include = filterFn(value);

    if (!isFinal) {
      return include ? value : ReturnEarly;
    }

    accumulator = include ? [...accumulator, value] : accumulator;
    return accumulator;
  };
}
