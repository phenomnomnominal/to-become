export type Constraint = (expected: string, actual: string) => boolean;

declare global {
    // eslint-disable-next-line
    namespace jest {
        interface Matchers<R> {
            toBecome<T>(this: Matchers<T>, constraint: Constraint): void;
        }
    }
}
