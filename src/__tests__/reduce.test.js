import { describe, it, expect } from 'vitest';

import { reduce } from '../reduce';

describe('reduce', () => {
  const doublerMap = (accumulator, value) => [...accumulator, value * 2];
  const assign = (accumulator, value) => {
    return {
      ...accumulator,
      ...value,
    };
  };

  it('returns a reducer function', () => {
    const reducer = reduce(doublerMap, []);

    expect(typeof reducer).toEqual('function');
  });

  describe('reducer', () => {
    it('works with array -> array reducers', () => {
      const startAccumulator = [];
      const reducer = reduce(doublerMap, startAccumulator);

      const acc1 = reducer(7, true);
      const acc2 = reducer(8, true);
      const acc3 = reducer(9, true);

      expect(acc1).toEqual([14]);
      expect(acc2).toEqual([14, 16]);
      expect(acc3).toEqual([14, 16, 18]);
    });

    it('works with array -> object reducers', () => {
      const startAccumulator = {};
      const reducer = reduce(assign, startAccumulator);

      const acc1 = reducer({ a: 1 }, true);
      const acc2 = reducer(
        {
          b: 2,
        },
        true
      );
      const acc3 = reducer(
        {
          c: 3,
        },
        true
      );

      expect(acc1).toEqual({ a: 1 });
      expect(acc2).toEqual({ a: 1, b: 2 });
      expect(acc3).toEqual({ a: 1, b: 2, c: 3 });
    });

    it('throws an error if it is not the final reducer in the chain', () => {
      const startAccumulator = [];
      const reducer = reduce(doublerMap, startAccumulator);

      expect(() => reducer(7, false)).toThrow();
    });
  });
});
