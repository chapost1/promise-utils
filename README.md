# Promise Utils

![Node](https://img.shields.io/badge/node-%3E%3D%208.0.0-green)
![LTS](https://img.shields.io/badge/LTS-v0.0.1-blue)

This package provides a set of utility functions to simplify common tasks related to working with promises. It offers a simple syntax for error handling and aims to reduce the potential for low-level bugs. It should make working with promises easier.

## Installation

### Choose your preferred way to install

#### In your package.json file:
```json
"promise-utils": "git+https://github.com/chapost1/promise-utils.git#v0.0.1"
```

#### Or using NPM:
```sh
npm install git+https://github.com/chapost1/promise-utils.git#v0.0.1
```

## Usage

The library exports a single object with all the utility functions.

You can import the library using the following syntax:

```js
const promiseUtils = require('promise-utils');
```

## API


- [wrap](#promiseutilswrap)
- [all](#promiseutilsall)
- [allSettled](#promiseutilsallsettled)
- [any](#promiseutilsany)
- [race](#promiseutilsrace)
- [delay](#promiseutilsdelay)
- [each](#promiseutilseach)
- [eachLimit](#promiseutilseachlimit)
- [eachOrderedJit](#promiseutilseachorderedjit)
- [executeInReverseOrder](#promiseutilsexecuteinreverseorder)


### promiseUtils.wrap

The `wrap` function is used to wrap a promise and return a tuple with the error and data. The function takes in a promise as input and returns a new promise. The new promise, when resolved, returns a tuple that consists of the error and data. The error is null if the promise is resolved successfully and the data is the resolved value. In case the promise is rejected, the error is the rejected error and the data is null. The function is useful for handling promises in a cleaner and more concise manner.

Here's an example usage:

```js
const promiseUtils = require('promise-utils');

const [err, data] = await promiseUtils.wrap(fetch('https://example.com'));
if (err) {
  console.error(err);
} else {
  console.log(data);
}
```

### promiseUtils.all

The `all` function takes an array of promises as input and returns a single promise that resolves to an array containing the following elements:

- The first error that occurred in any of the promises, or null if all the promises resolved successfully.
- The index of the first rejected promise, or null if all the promises resolved successfully.
- An array of resolved values from the input promises in the order they were passed in, or null if one of the promises rejected.

The function first checks if the input is an array. If not, it throws a TypeError. If the input array is empty, it returns a resolved promise with null values. If the input array is not empty, it creates a new promise that will resolve when either all the promises in the input array have resolved or when the first promise in the input array rejects.

Here's an example usage:

```js
const promiseUtils = require('promise-utils');

const promises = [
  fetch('https://example.com'),
  fetch('https://another-example.com'),
  fetch('https://yet-another-example.com')
];

const [rejectedError, rejectedIndex, orderedResolvedData] = await promiseUtils.all(promises);
if (rejectedError) {
  console.error(rejectedError);
} else {
  console.log(orderedResolvedData);
  // orderedResolvedData is an array of the resolved values of the promises in the same order as the input array
}
```

### promiseUtils.allSettled

The `allSettled` function takes an array of promises and returns an array of objects that contain either the resolved data or the error if it was rejected. It never rejects, but always resolves, and it resolves once all the promises in the input array have resolved or rejected. It returns an array of tuples, where each tuple has the format [error, data], where error is null if the promise was resolved, and data is the resolved value. If any of the promises in the input array are rejected, the error will contain the rejection reason. If the input is not an array of promises, it will throw a TypeError.

Here's an example usage:

```js
const promiseUtils = require('promise-utils');

const promises = [
  fetch('https://example.com'),
  fetch('https://another-example.com'),
  fetch('https://yet-another-example.com')
];

const results = await promiseUtils.allSettled(promises);
console.log(results);
// results is an array of objects, each containing either the resolved data or the rejected error of each promise
// Example: [
    // [null, 'some data'],
    // [null, 'some other data'],
    // [Error('some error'), null],
// ]
```

### promiseUtils.any

The `any` function takes in an array of promises and returns the first resolved promise with its index, its data, and the index of the resolved promise. If all promises in the input array are rejected, it will return the ordered errors, null for the data, and null for the index. It throws a TypeError if the input is not an array. This function is useful when you want to get the result from the first resolved promise out of multiple promises, but also need to know about the rejected promises in case all promises are rejected.
The function returns an array with three elements:
- The errors of all the rejected promises, or null if at least one promise resolved successfully.
- The data of the first resolved promise, or null if all promises were rejected.
- The index of the first resolved promise, or null if all promises were rejected.

Here's an example usage:

```js
const promiseUtils = require('promise-utils');

const [errors, resolvedData, resolvedIndex] = await promiseUtils.any(fetch('https://example.com'));
if (errors) {
  console.error(errors);
} else {
  console.log(resolvedData);
}
```

### promiseUtils.race

`race` is a function that takes an array of promises as input and returns a Promise that is always resolved.
It resolved with the result of the first promise in the input array that is resolved or with the rejected error of the first promise that is rejected

It returns an array with three elements:

- The error (if any) of the first promise that resolved or rejected
- The data of the first promise that resolved
- The index of the first promise that resolved or rejected


Here's an example usage:

```js
const promiseUtils = require('promise-utils');

const promises = [
  fetch('https://example.com'),
  fetch('https://another-example.com'),
  fetch('https://yet-another-example.com')
];

const [error, data, index] = await promiseUtils.race(promises);
if (error) {
  console.error(error);
} else {
  console.log(data);
}
```

### promiseUtils.delay

The `delay` function takes a number as input and returns a Promise that resolves after the specified number of milliseconds.

Here's an example usage:

```js
const promiseUtils = require('promise-utils');

const delay = 1000;

await promiseUtils.delay(delay);
// The code will wait for 1 second before continuing
```

### promiseUtils.each

The `each` function takes an array of items and an asynchronous operation as its arguments. It runs the asynchronous operation on each item and returns an array of results or errors in the same order as the items. The function returns a promise that resolves with the array of results or errors. If the input is not an array, a TypeError is thrown.

Here's an example usage:

```js
const promiseUtils = require('promise-utils');

const items = [1, 2, 3, 4, 5];

const asyncOperation = async (item) => {
  await promiseUtils.delay(1000);
  // of course, you can do anything you want here (i.e: fetch data from an API)
  return item * 2;
};

const results = await promiseUtils.each(items, asyncOperation);
console.log(results);
// results is an array of the results of the asyncOperation on each item in the same order as the input array
// Example: [
  [null, 2],
  [null, 4],
  [null, 6],
  [Error('something went wrong'), null],
  [null, 10]
]
```

### promiseUtils.eachLimit

The `eachLimit` function takes an array of items, a limit for the number of async operations that can run at the same time, and an async operation to be performed on each item. It returns an array of the results/errors from the async operation, in the same order as the original items. The limit argument is used to limit the number of async operations that can run at the same time, so that you can control how many resources are used at a given time. If the limit is greater than the number of items, it will be set to the number of items. The function ensures that the results/errors are returned in the same order as the original items, by keeping track of the index of each item. If the limit is 0 or less, or if the input is not an array, the function will throw an error.

Here's an example usage:

```js
const promiseUtils = require('promise-utils');

const items = [1, 2, 3, 4, 5];

const asyncOperation = async (item) => {
  await promiseUtils.delay(1000);
  // of course, you can do anything you want here (i.e: fetch data from an API)
  return item * 2;
};

const results = await promiseUtils.eachLimit(items, 2, asyncOperation);
// The asyncOperation will be performed on two items at a time
console.log(results);
// results is an array of the results of the asyncOperation on each item in the same order as the input array
// Example: [
  [null, 2],
  [null, 4],
  [null, 6],
  [Error('something went wrong'), null],
  [null, 10]
]
```

### promiseUtils.eachOrderedJit

The `eachOrderedJit` function is an asynchronous function that takes an array of items, an async operation, and a feedback function as its arguments. It runs the async operation on each item in parallel and calls the feedback function with the result/error of each item just in time (JIT) in the same order.
It returns an array of the results/errors in the same order as the original items. If the input is not an array, a TypeError is thrown.

This means that if the first item takes 10 seconds to finish, the first feedback function will be called after 10 seconds, and if the second item finishes before the first item, the second feedback function will be called immediately. The function returns an array of the results/errors in the same order.

Here's an example usage:

```js
const promiseUtils = require('promise-utils');

const items = [1, 2, 3, 4, 5];

const asyncOperation = async (item) => {
  await promiseUtils.delay(1000);
  // of course, you can do anything you want here (i.e: fetch data from an API)
  return item * 2;
};

const feedback = (error, result) => {
  if (error) {
    console.error(error);
    return;
  }
  console.log(result);
};

const results = await promiseUtils.eachOrderedJit(items, asyncOperation, feedback);
console.log(results);
// results is an array of the results of the asyncOperation on each item in the same order as the input array
// Example: [
  [null, 2],
  [null, 4],
  [null, 6],
  [Error('something went wrong'), null],
  [null, 10]
]
```

### promiseUtils.executeInReverseOrder

The `executeInReverseOrder` function is a utility function which takes an array of promise functions as its first argument and an optional number of attempts for each promise as its second argument.

The function then executes each promise in the array in reverse order, meaning the last promise in the array is executed first and so on. If a promise fails, the function will retry it the specified number of times (minus 1) (defaults to 1). If the promise still fails after all the attempts, the function will return an array containing the error and the index of the failed promise.

It does not affect the original array of Promises.

The function returns an array of two elements:
- The error (if any) of the last promise that rejected
- The index of the last promise that rejected

Here's an example usage:

```js
const promiseUtils = require('promise-utils');

const promises = [
  () => Promise.resolve('first'),
  () => Promise.resolve('second'),
  () => Promise.reject(new Error('Oh no, something went wrong!')),
  () => Promise.resolve('fourth')
]

const [error, failedOperationIndex] = await promiseUtils.executeInReverseOrder(promises, 2)

if (error) {
  console.log(`Failed at index ${failedOperationIndex}: ${error.message}`)
} else {
  console.log('All promises succeeded!')
}
```

## License

This library is licensed under the MIT License.

## Contributing

Contributions are welcome! Please open an issue or a pull request if you have any suggestions or if you find a bug.
