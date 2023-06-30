import { describe, it, expect } from 'vitest';

import { ReturnEarly } from '../compose.js';

import { filter } from '../filter';

describe('filter', () => {
  const greaterThan5 = (value) => value > 5;
  const greaterThan10 = (value) => value > 10;

  it('returns a reducer function', () => {
    const reducer = filter(greaterThan5);

    expect(typeof reducer).toEqual('function');
  });

  describe('reducer', () => {
    describe('passing through a value to another reducer', () => {
      it('includes values', () => {
        const reducer = filter(greaterThan5);

        const valueOut = reducer(7, false);

        expect(valueOut).toEqual(7);
      });

      it('excludes values', () => {
        const reducer = filter(greaterThan10);

        const valueOut = reducer(7, false);

        expect(valueOut).toBe(ReturnEarly);
      });
    });

    describe('returning the final result', () => {
      it('includes values', () => {
        const reducer = filter(greaterThan5);

        const valueOut = reducer(7, true);

        expect(valueOut).toEqual([7]);
      });

      it('excludes values', () => {
        const reducer = filter(greaterThan10);

        const valueOut = reducer(7, true);

        expect(valueOut).toEqual([]);
      });
    });
  });
});
