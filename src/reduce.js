export function reduce(reduceFn, initial) {
  function reduceReducer(accumulator, value) {
    return {
      accumulator: reduceFn(accumulator, value),
      valueOut: undefined,
    };
  }
  reduceReducer.initial = initial;

  return reduceReducer;
}
