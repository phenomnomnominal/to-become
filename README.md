# @phenomnomnominal/to-become

[![npm version](https://img.shields.io/npm/v/@phenomnomnominal/to-become.svg)](https://www.npmjs.com/package/@phenomnomnominal/to-become)

`toBecome` is a new assertion for [Jest](https://www.npmjs.com/package/jest) that allows you to assert how your code should behave over time.

It's a bit of an experiment that uses [Jest snapshot testing](https://jestjs.io/docs/en/snapshot-testing) to store information about a test that may change.

## What does it look like?

```typescript
import { smaller } from '@phenomnominal/to-become';

import { runLint } from 'linter';

describe('my-thing', () => {
  it('should only ever get smaller', async () => {
    const lintFailures = await runLint();
    expect(lintFailures).toBecome(smaller);
  });
});
```

## Installation

```sh
npm install @phenomnomnominal/to-become --save-dev
```

## How does it work?

`toBecome` enables you to run a special kind of snapshot test. The first time your test runs, `toBecome` will save a snapshot, just like `toMatchSnapshot`. If the result of the code-under-test changes on a later test run, a special function (which I'm calling the `constraint`) will run that compares the `actual` and the `expected` value. If the new value still passes that constrain, the snapshot is updated to the new value, and the test will still pass.

Here's a simple example:

```typescript
import { bigger } from '@phenomnomnominal/to-become';

describe('my-thing', () => {
  it('should only ever get bigger', async () => {
    expect(Date.now()).toBecome(bigger);
  });
});
```

The first time the test runs, the current timestamp will be saved to the snapshot file.

Each time the test runs in the future, the `bigger` constraint will run, and compare the value from the snapshot with the new current timestamp. That should always be bigger, so the snapshot will be updated, and the test will pass.

If time was to stop, the test would *still pass*. The value doesn't *have* to get bigger, but if it changes, it is only allowed to get bigger.

If time should ever start to go backward, the constraint would fail and the test would fail.

## Potential use cases

* Incrementally reducing lint rule warnings
* Incrementally reducing type-checking errors
* Incrementally reducing the number of accessibility audit failures
* Avoiding performance regressions
* Other things?

## Custom constraints

I haven't come up with any clear use-cases for anything other than `bigger` or `smaller`, but they may exist? If you come up with an idea then **a)** let me know, and **b)** try out this:

```typescript
// Import the package to add the `toBecome` assertion to `expect`:
import '@phenomnominal/to-become';

function myConstraint (expected: string, actual: string): boolean {
  // parse values from the snapshot
  const e = JSON.parse(expected);
  const a = JSON.parse(actual);
  // Compare something deeply nested maybe? I dunno.
  return e.foo.bar > a.foo.bar;
}

describe('my-thing', () => {
  it('should change in some expected way', () => {
    expect(something).toBecome(myConstraint);
  });
});
```
