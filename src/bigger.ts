export function bigger(expected: string, actual: string): boolean {
    return parseFloat(expected) < parseFloat(actual);
}
