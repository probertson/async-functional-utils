export const ReturnEarly = Symbol(
  'stop processing a value and move to the next value'
);

export function compose(...reducers) {
  return async function composedFunctions(valueGenerator) {
    let accumulator;

    while (true) {
      const { done, value } = await valueGenerator.next();

      if (done) {
        break;
      }

      let nextValue = value;
      reducers.some((reducer, index, allReducers) => {
        const isFinal = index === allReducers.length - 1;
        const valueOut = reducer(nextValue, isFinal);

        if (valueOut === ReturnEarly) {
          return true;
        }

        if (isFinal) {
          accumulator = valueOut;
        } else {
          nextValue = valueOut;
        }
        return false;
      });
    }

    return accumulator;
  };
}
