export function compose(...reducers) {
  return async function composedFunctions(valueGenerator) {
    const accumulators = reducers.map((reducer) => reducer.initial);

    while (true) {
      const { done, value } = await valueGenerator.next();

      if (done) {
        break;
      }

      let nextValue = value;
      reducers.some((reducer, index) => {
        const oldAccumulator = accumulators[index];

        const { accumulator, valueOut } = reducer(oldAccumulator, nextValue);
        accumulators[index] = accumulator;
        nextValue = valueOut;

        return oldAccumulator === accumulator;
      });
    }

    return accumulators[accumulators.length - 1];
  };
}
