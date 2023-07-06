export const ReturnEarly = Symbol(
  'stop processing a value and move to the next value'
);

export type ReturnEarlyType = typeof ReturnEarly;
export type ReducerNextValue<T> = T | ReturnEarlyType;
export type NonFinalReducer<In, Out> = (
  value: In,
  isFinal: boolean
) => ReducerNextValue<Out>;
export type FinalReducer<T, TResult> = (value: T, isFinal: boolean) => TResult;

type ComposedReducers<T, TResult> = (
  valueGenerator: AsyncGenerator<T>
) => Promise<TResult>;

// Fallback for more than four reducers
export function compose<T, T2, T3, T4, TResult>(
  firstReducer: NonFinalReducer<T, T2 | ReturnEarlyType>,
  secondReducer: NonFinalReducer<T2, T3 | ReturnEarlyType>,
  thirdReducer: NonFinalReducer<T2, T4 | ReturnEarlyType>,
  ...reducers: [
    NonFinalReducer<T4, unknown>,
    ...NonFinalReducer<unknown, unknown>[],
    FinalReducer<unknown, TResult>
  ]
): ComposedReducers<T, TResult>;
// Four reducers
export function compose<T, T2, T3, T4, TResult>(
  firstReducer: NonFinalReducer<T, T2 | ReturnEarlyType>,
  secondReducer: NonFinalReducer<T2, T3 | ReturnEarlyType>,
  thirdReducer: NonFinalReducer<T2, T4 | ReturnEarlyType>,
  finalReducer: FinalReducer<T4, TResult>
): ComposedReducers<T, TResult>;
// Three reducers
export function compose<T, T2, T3, TResult>(
  firstReducer: NonFinalReducer<T, T2 | ReturnEarlyType>,
  secondReducer: NonFinalReducer<T2, T3 | ReturnEarlyType>,
  finalReducer: FinalReducer<T3, TResult>
): ComposedReducers<T, TResult>;
// Two reducers
export function compose<T, T2, TResult>(
  reducer: NonFinalReducer<T, T2 | ReturnEarlyType>,
  finalReducer: FinalReducer<T2, TResult>
): ComposedReducers<T, TResult>;
// One reducer
export function compose<T, TResult>(
  reducer: FinalReducer<T, TResult>
): ComposedReducers<T, TResult>;

export function compose<T, TResult>(
  ...reducers: (NonFinalReducer<T, unknown> | FinalReducer<T, TResult>)[]
) {
  return async function composedFunctions(valueGenerator: AsyncGenerator<T>) {
    let accumulator: TResult | undefined;

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
          accumulator = valueOut as TResult;
        } else {
          nextValue = valueOut as T;
        }
        return false;
      });
    }

    return accumulator;
  };
}
