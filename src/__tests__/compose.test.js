import { filter } from '../filter';
import { map } from '../map';
import { reduce } from '../reduce';

import { compose } from '../compose';

describe('compose', () => {
  const plus1Map = (value) => value + 1;
  const greaterThan10Filter = (value) => value > 10;
  const noNameFilter = (value) =>
    value.hasOwnProperty('firstName') ||
    value.hasOwnProperty('middleName') ||
    value.hasOwnProperty('lastName');
  const doublerReducer = (accumulator, value) => [...accumulator, value * 2];
  const assignReducer = (accumulator, value) => {
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
    const result = await compose(
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
