export function smaller(expected: string, actual: string): boolean {
    return parseFloat(expected) > parseFloat(actual);
}
