import { FinalReducer, NonFinalReducer } from './compose';

// Non-final reducer
export function map<In, Out>(
  mapFn: (value: In) => Out
): NonFinalReducer<In, Out>;
// Final reducer
export function map<In, Out>(
  mapFn: (value: In) => Out
): FinalReducer<In, Out[]>;

export function map<In, Out>(mapFn: (value: In) => Out) {
  let accumulator: Out[] = [];

  return function mapReducer(value: In, isFinal: boolean) {
    const mappedValue = mapFn(value);

    if (!isFinal) {
      return mappedValue;
    }

    accumulator = [...accumulator, mappedValue];
    return accumulator;
  };
}
