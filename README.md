# async-generator-functional-utils

Utilities for functional programming with asynchronous JavaScript data (using async iterators). Use functional programming operations on async data (for example, streams)!

Of course it's possible to just build up the raw data from an async generator or stream and then apply functional operations synchronously. However, for large sets of data this can require significant amounts of memory. This library operates on the data stream as it flows, applying the reduce operations to one piece of data at a time _over time_ -- so only the final transformed data is stored as a single blob in memory.

You can have your (functional) cake and still use memory-saving async techniques!

### Example

```
import { compose, filter, map } from 'async-generator-functional-utils';

// Get some "async" data using an async generator
async function* count() {
  for await (const a of [8, 9, 10, 11, 12]) {
    yield a;
  }
}

// Use `compose` to combine functional operations
const result = await compose(
  // `filter` takes a filter function and only passes through
  // values that match the filter criteria
  filter((value) => value > 10),
  // `map` passes through each value, transformed by the map operation
  map((value) => value + 1)
)(count() /* call generator function here */);

// result === [12, 13]
```

## API

### `compose(...reducers)(iterator): Promise<Array|Object>`

The `compose` function is the core of the library. Use `compose` to specify the iterator (usually created by a `function*` generator) whose data will be transformed, and the functional operations to apply to that data.

As pieces of data are pushed out by the iterator, `compose` calls the reducers one-by-one with each new piece of data. Reducers are chained, so the output of the first reducer (applied to the value) is passed to the next reducer as the input value. The accumulated result of the final reducer is eventually returned (once all iterations are complete).

`compose` is a higher-order function -- it creates a composed function of functional operations. You call that function, passing it a generator function (the "data source"), and it returns a Promise that is resolved when the generator returns an iterator with `done: true`:

```
async function* myGenerator() { ... };

const resultPromise = compose(
  [reducer1],
  [reducer2],
  [reducer3],
  ...,
  [reducerN]
)(myGenerator());

resultPromise.then((result) => {
  console.log('result', result); // the final result of generator -> transformations
});

```

#### `compose` Arguments:

- `...reducers`: One or more reducer operations to use to transform the data. These can be the operations from this library (`reduce`, `map`, `filter`) or you can write your own higher-level operations. (Tip: all the functional operations are built on top of `reduce`).

#### `compose` Return value:

- A composed function `composedFn(iterator: Iterable): Promise<Array | Object>`: Call this function with an iterator (usually returned by an async generator); the reducer operations will be asynchronously applied to the iterator values as each new value is yielded.

#### `composedFn` Argument:

- `iterator`: An object that conforms to the [iterator protocol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#the_iterator_protocol) ([**Iterable** interface in TypeScript](https://www.typescriptlang.org/docs/handbook/iterators-and-generators.html#iterable-interface)). In practice this will be an async iterator returned from calling an async generator (`async function*`) function.

#### `composedFn` Return value:

- `Promise<Array | Object>`: A Promise that resolves when the iterator has yielded its final value.

The resolved value is an Object if the final reducer passed to `compose` is a `reduce` reducer; otherwise (e.g. if the final reducer is a `map` or `filter` reducer) the resolved value is an Array with one element per iteration value.

### `filter(filterFn)`

Use the `filter` reducer to only pass a subset of data to subsequent reducers (or the result). Like `Array.filter()`, it takes a filter function as an argument to specify the filter criteria.

#### `filter` Argument:

- `filterFn: (value: any) => boolean`: A function you provide to test each `value` to determine whether to keep or discard it. Return `true` to pass the value through to the next reducer (or result); return `false` to exclude it.

### `map(mapFn)`

Use the `map` reducer to apply a transformation to each value. This behaves like `Array.map()` -- you pass it a function to define the transform operation.

#### `map` Argument:

- `mapFn: (value: any) => any`: A function you provide to define the transformation to map input values to output values. Given `value` as the first parameter, return the output value that will be passed to the next reducer (or result).

### `reduce(reducerFn, initialValue)`

Use the `reduce` reducer to combine the set of values into a single result value. This can be some type of collection, an object (for example with properties derived from values), the result of an aggregate computation (e.g. the sum of all values), or anything else you desire. This behaves like `Array.reduce()` in that you give it two arguments: a reducer function to define the transformation, and an initial value that is passed to the reducer function as the accumulator on the first iteration.

Note: unlike other reducers, `reduce` must be the final reducer in the composed reducer chain. The output of `reduce` can be any object type, so it is not iterable.

#### `reduce` Arguments:

- `reducerFn: (accumulator: <T>, value: any) => <T>`: A function you provide to define the transformation that creates the eventual result. Your reducer function should accept two arguments and return the accumulator to be passed to the next iteration (or to be returned as the final result).

  ##### `reducerFn` Arguments:

  - `accumulator: <T>`: the current state of the result after all previous iterations; on the first iteration this will be the `initialValue` passed as the second argument to `reduce()`, and it will usually be a modified version of that value.
  - `value: any`: the value passed into this reducer for the current iteration

  ##### `reducerFn` Return value:

  - `<T>`: The state of the in-progress result (i.e. the accumulator) at the end of the current iteration. This value is passed to the next call of `reducerFn` as the `accumulator` argument, and (after the final iteration) returned as the result of the functional operation(s).

- `initialValue: <T>`: The starting point of the value that is being computed by the reducer. This value is passed to the `reducerFn` on the first iteration, and will usually be an "empty" version of the eventual result.

## Making a custom reducer

One foundation of functional programming is that all functional operations are simply specialized implementations built on top of `reduce`. That is true for this library as well (`map` and `filter` are both implemented as `reduce` operations, because internally `compose` treats all reducers as `reduce` operations). This makes writing a reducer for this library very much like writing a reducer function for `Array.reduce()`.

In fact, with `map` and `reduce` already available, chances are you don't even need to make a custom reducer -- almost any transformation you want to apply to the data can be implemented using the built-in reducers:

- `map`: for one-to-one operations, where each input value is transformed in some way and then added to the output as an individual value
- `reduce`: for many-to-one (or many-to-N) operations, where each input value is used to modify the final output in some way
- `filter`: for when you want to exclude certain values immediately, before applying `map` or `reduce` operations.

Nevertheless, if you find yourself wanting to make a custom reducer, you certainly can (also, please submit a pull request to add the functionality to this library 😊)

To make your own custom reducer to use with this library, you must specify two things:

1. The reducer function to be called (like the first argument of `Array.reduce()`)
2. The initial value of the reducer (like the second argument of `Array.reduce()`)

In this case the two things are bundled together in a single object: the reducer function itself, and a property named `initial` added to the reducer Function object.

### The reducer function

A function that implements the reducer signature (a modified version of the signature for functions passed to `Array.reduce()`):

```
function reducer(accumulator: <T>, value: any): { accumulator: [], valueOut: any }
```

#### `reducer` Arguments:

- `accumulator`: The "result" of the reducer, collected and modified over each iteration
- `value`: The value passed through for the current iteration.

Note that unlike `Array.reduce`, no third and fourth arguments (`index` and `collection`) are passed to the `reducer` function. This is because of the asynchronous nature of the operations (so "index" and "collection" don't really exist) as well as the fact that maintaining the entire `collection` in memory would go against the point of this library, to be able to operate on the data one piece at a time over time.

#### `reducer` Return value:

- An object with two properties:
  - `accumulator`: The new "result" of the reducer, usually the previous `accumulator` argument (potentially) modified in some way based on the `value`
  - `valueOut`: The output value that is passed to the next reducer. This is usually the `value` argument with some transformation applied. Set `valueOut` to `undefined` to short-circuit the current iteration and not pass anything to any subsequent reducer(s).

### The `initial` value:

This is the intial state of the accumulator result of this reducer operation. This is conceptually identical to the second argument passed to `Array.reduce()`. If the operation is a `map`-like operation that treats each iteration value as an element in an Array, set `initial` to `[]`. Otherwise set it to a reasonable initial value for your accumulator.

```
function myCustomReducerOperation(accumulator, value) { /* ... */ }
myCustomReducerOperation.initial = []; // or {} or whatever you want
```

### Putting it together

Your final reducer should be a function that takes any necessary arguments and returns a function (the reducer function augmented with `initial` property). For example here is a reducer that is like `lodash`'s `map` operation with the "property name" shorthand (i.e. it "picks" the property with the specified name from each value and returns an array of those properties' values):

```
function pickMap(propName) {
  // Define the reducer
  function pickMapReducer(accumulator, value) {
    const picked = value[propName];

    return {
      accumulator: [...accumulator, picked],
      valueOut: picked,
    };
  }

  // Add the initial value
  pickMapReducer.initial = [];

  return pickMapReducer;
}

// Assume a generator `aAndB` that returns values in the form {a: 'foo', b: 'bar' }

const aValuesOnly = await compose(pickMap('a'))(aAndB());

// aValuesOnly === ['foo', ...]
```
