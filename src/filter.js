export function filter(filterFn) {
  function filterReducer(accumulator, value) {
    if (filterFn(value)) {
      return {
        accumulator: [...accumulator, value],
        valueOut: value,
      };
    }

    return {
      accumulator,
      valueOut: undefined,
    };
  }
  filterReducer.initial = [];

  return filterReducer;
}
