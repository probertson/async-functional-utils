import { describe, it, expect } from 'vitest';

import { map } from '../map';

describe('map', () => {
  const identity = (value) => value;
  const plus1 = (value) => value + 1;

  it('returns a reducer function', () => {
    const reducer = map(identity);

    expect(typeof reducer).toEqual('function');
  });

  describe('reducer', () => {
    it('works with `identity`', () => {
      const reducer = map(identity);
      const startAccumulator = [];

      const { accumulator, valueOut } = reducer(startAccumulator, 7);

      expect(accumulator[0]).toEqual(7);
      expect(valueOut).toEqual(7);
    });

    it('works with `plus1`', () => {
      const reducer = map(plus1);
      const startAccumulator = [];

      const { accumulator, valueOut } = reducer(startAccumulator, 7);

      expect(accumulator[0]).toEqual(8);
      expect(valueOut).toEqual(8);
    });
  });
});
