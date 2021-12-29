export function map(mapFn) {
  function mapReducer(accumulator, value) {
    const valueOut = mapFn(value);
    return {
      accumulator: [...accumulator, valueOut],
      valueOut,
    };
  }
  mapReducer.initial = [];

  return mapReducer;
}
