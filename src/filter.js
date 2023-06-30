import { ReturnEarly } from './compose.js';

export function filter(filterFn) {
  let accumulator = [];

  return function filterReducer(value, isFinal) {
    const include = filterFn(value);

    if (!isFinal) {
      return include ? value : ReturnEarly;
    }

    accumulator = include ? [...accumulator, value] : accumulator;
    return accumulator;
  };
}
