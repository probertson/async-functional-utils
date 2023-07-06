import { describe, it, expect, vi } from 'vitest';

import { filter } from '../filter';
import { map } from '../map';
import { reduce } from '../reduce';

import { compose, ReturnEarly } from '../compose';

describe('compose', () => {
  const plus1Map = (value: number) => value + 1;

  const greaterThan10Filter = (value: number) => value > 10;

  type MaybeNameObject = {
    firstName?: string;
    middleName?: string;
    lastName?: string;
  };

  const noNameFilter = (value: MaybeNameObject) =>
    Object.prototype.hasOwnProperty.call(value, 'firstName') ||
    Object.prototype.hasOwnProperty.call(value, 'middleName') ||
    Object.prototype.hasOwnProperty.call(value, 'lastName');

  const doublerReducer = (accumulator: number[], value: number) => [
    ...accumulator,
    value * 2,
  ];

  const assignReducer = (accumulator: object, value: object) => {
    return {
      ...accumulator,
      ...value,
    };
  };

  async function* count() {
    for await (const a of [8, 9, 10, 11, 12]) {
      yield a;
    }
  }

  async function* nameSegments() {
    for await (const o of [
      { firstName: 'Bob' },
      { middleName: 'Billy' },
      { title: 'Dr.' },
      { lastName: 'Beanstalk' },
      { suffix: 'Jr.' },
    ]) {
      yield o;
    }
  }

  it('stops processing when a reducer returns ReturnImmediately', async () => {
    // A reducer that filters out everything
    function impregnableFortress() {
      return function reducer() {
        return ReturnEarly;
      };
    }

    const unreachableReducer = vi.fn();
    function unreachable() {
      return unreachableReducer;
    }

    await compose(impregnableFortress(), unreachable())(count());

    expect(unreachableReducer).not.toHaveBeenCalled();
  });

  it('filters', async () => {
    const result = await compose(filter(greaterThan10Filter))(count());

    expect(result).toEqual([11, 12]);
  });

  it('maps', async () => {
    const result = await compose(map(plus1Map))(count());

    expect(result).toEqual([9, 10, 11, 12, 13]);
  });

  it('reduces', async () => {
    const result = await compose(reduce(assignReducer, {}))(nameSegments());

    expect(result).toEqual({
      title: 'Dr.',
      firstName: 'Bob',
      middleName: 'Billy',
      lastName: 'Beanstalk',
      suffix: 'Jr.',
    });
  });

  it('combines filter and map', async () => {
    const result = await compose(
      filter(greaterThan10Filter),
      map(plus1Map)
    )(count());

    expect(result).toEqual([12, 13]);
  });

  it('combines map and filter', async () => {
    const result = await compose(
      map(plus1Map),
      filter(greaterThan10Filter)
    )(count());

    expect(result).toEqual([11, 12, 13]);
  });

  it('combines filter and reduce (array -> array)', async () => {
    const result = await compose(
      filter(greaterThan10Filter),
      reduce(doublerReducer, [])
    )(count());

    expect(result).toEqual([22, 24]);
  });

  it('combines filter and reduce (array -> object)', async () => {
    const result = await compose<
      MaybeNameObject,
      MaybeNameObject,
      MaybeNameObject
    >(
      filter(noNameFilter),
      reduce(assignReducer, {})
    )(nameSegments());

    expect(result).toEqual({
      firstName: 'Bob',
      middleName: 'Billy',
      lastName: 'Beanstalk',
    });
  });
});
