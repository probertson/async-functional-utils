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
    describe('passing through a value to another reducer', () => {
      it('works with `identity`', () => {
        const reducer = map(identity);

        const valueOut = reducer(7, false);

        expect(valueOut).toEqual(7);
      });

      it('works with `plus1`', () => {
        const reducer = map(plus1);

        const valueOut = reducer(7, false);

        expect(valueOut).toEqual(8);
      });
    });

    describe('returning the final result', () => {
      it('works with `identity`', () => {
        const reducer = map(identity);

        const valueOut = reducer(7, true);

        expect(valueOut).toEqual([7]);
      });

      it('works with `plus1`', () => {
        const reducer = map(plus1);

        const valueOut = reducer(7, true);

        expect(valueOut).toEqual([8]);
      });
    });
  });
});
