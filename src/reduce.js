export function reduce(reduceFn, initial) {
  let accumulator = initial;

  return function reduceReducer(value, isFinal) {
    if (!isFinal) {
      throw new Error(
        'The `reduce` reducer does not pass through a value, so it must be the final reducer in a composed reducer chain.'
      );
    }

    accumulator = reduceFn(accumulator, value);
    return accumulator;
  };
}
