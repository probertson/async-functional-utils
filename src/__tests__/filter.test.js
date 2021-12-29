import { filter } from '../filter';

describe('filter', () => {
  const greaterThan5 = (value) => value > 5;
  const greaterThan10 = (value) => value > 10;

  it('returns a reducer function', () => {
    const reducer = filter(greaterThan5);

    expect(typeof reducer).toEqual('function');
  });

  describe('reducer', () => {
    it('includes values', () => {
      const reducer = filter(greaterThan5);
      const startAccumulator = [];

      const { accumulator, valueOut } = reducer(startAccumulator, 7);

      expect(accumulator[0]).toEqual(7);
      expect(valueOut).toEqual(7);
    });

    it('excludes values', () => {
      const reducer = filter(greaterThan10);
      const startAccumulator = [];

      const { accumulator, valueOut } = reducer(startAccumulator, 7);

      expect(accumulator.length).toEqual(0);
      expect(valueOut).toBeUndefined();
    });
  });
});
