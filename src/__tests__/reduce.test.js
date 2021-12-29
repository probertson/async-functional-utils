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

      const { accumulator: acc1, valueOut: valueOut1 } = reducer(
        startAccumulator,
        7
      );
      const { accumulator: acc2, valueOut: valueOut2 } = reducer(acc1, 8);
      const { accumulator: acc3, valueOut: valueOut3 } = reducer(acc2, 9);

      expect(acc1).toEqual([14]);
      expect(acc2).toEqual([14, 16]);
      expect(acc3).toEqual([14, 16, 18]);
      expect(valueOut1).toBeUndefined();
      expect(valueOut2).toBeUndefined();
      expect(valueOut3).toBeUndefined();
    });

    it('works with array -> object reducers', () => {
      const startAccumulator = {};
      const reducer = reduce(assign, startAccumulator);

      const { accumulator: acc1, valueOut: valueOut1 } = reducer(
        startAccumulator,
        { a: 1 }
      );
      const { accumulator: acc2, valueOut: valueOut2 } = reducer(acc1, {
        b: 2,
      });
      const { accumulator: acc3, valueOut: valueOut3 } = reducer(acc2, {
        c: 3,
      });

      expect(acc1).toEqual({ a: 1 });
      expect(acc2).toEqual({ a: 1, b: 2 });
      expect(acc3).toEqual({ a: 1, b: 2, c: 3 });
      expect(valueOut1).toBeUndefined();
      expect(valueOut2).toBeUndefined();
      expect(valueOut3).toBeUndefined();
    });
  });
});
