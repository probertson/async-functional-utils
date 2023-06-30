export function map(mapFn) {
  let accumulator = [];

  return function mapReducer(value, isFinal) {
    const mappedValue = mapFn(value);

    if (!isFinal) {
      return mappedValue;
    }

    accumulator = [...accumulator, mappedValue];
    return accumulator;
  };
}
