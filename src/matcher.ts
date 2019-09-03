import { toMatchSnapshot } from 'jest-snapshot';

import { Constraint } from './types';

export function toBecome<T>(
    this: jest.MatcherUtils,
    received: T,
    constraint: Constraint,
): ReturnType<typeof toMatchSnapshot> {
    // The @types/jest typings don't seem right here, so we just
    // cast to `any` once:
    // eslint-disable-next-line
    const self = this as any;
    const testName = self.currentTestName;

    // Take a copy of the initial state so that we can put it back
    // how we found it:
    const prevCounters = self.snapshotState._counters.get(testName);
    const prevUpdateState = self.snapshotState._updateSnapshot;
    const prevUnmatched = self.snapshotState.unmatched;

    // Set some dumb state so that when we don't overwrite the saved
    // snapshot when we *read* it:
    self.snapshotState._updateSnapshot = 'definitely not';

    // Try to match with the existing snapshot. This will return either:
    // * { pass: true }  and empty string for `actual` and `expected`
    // * { pass: false } and the real value for `actual` and `expected`
    const snapshot = self.snapshotState.match({ received, testName });

    // Reset the snapshot state:
    self.snapshotState._counters.set(testName, prevCounters);
    self.snapshotState.unmatched = prevUnmatched;
    self.snapshotState._updateSnapshot = prevUpdateState;

    // Only want to update the snapshot if the snapshot failed but
    // the constraint is still valid:
    const snapshotPass = snapshot.pass;
    const constraintPass = constraint(snapshot.expected, snapshot.actual);

    // If the snapshot fails but the contraint passes, we want to update
    // the snapshot:
    if (!snapshotPass && constraintPass) {
        self.snapshotState._updateSnapshot = 'all';
    }

    const result = toMatchSnapshot.call(self, received);

    // If the snapshot fails but the contraint passes, we also need to reset
    // the error counters after the snapshot is updated:
    if (!snapshotPass && constraintPass) {
        self.snapshotState._counters.set(testName, prevCounters);
        self.snapshotState.unmatched = prevUnmatched;
        self.snapshotState._updateSnapshot = prevUpdateState;
    }

    // If we got a pass either way, return true:
    const pass = snapshotPass || constraintPass;
    if (pass) {
        return {
            pass,
            message: (): string => '',
        };
    }

    // Otherwise return the result from `toMatchSnapshot` with the good
    // error messages:
    return result;
}
