import { FinalReducer } from './compose';

export function reduce<T, TResult>(
  reduceFn: (accumulator: TResult, value: T) => TResult,
  initial: TResult
): FinalReducer<T, TResult> {
  let accumulator = initial;

  return function reduceReducer(value: T, isFinal: boolean) {
    if (!isFinal) {
      throw new Error(
        'The `reduce` reducer does not pass through a value, so it must be the final reducer in a composed reducer chain.'
      );
    }

    accumulator = reduceFn(accumulator, value);
    return accumulator;
  };
}
